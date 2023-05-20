var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var AddUser = require('./routes/user');
var login = require('./routes/login');
var textRouter = require('./routes/text');
var fileRouter = require('./routes/file');
var regionRouter = require('./routes/region');
var weatherRouter = require('./routes/weather');
var LocationRouter = require('./routes/city');
var JJlotteryRouter = require('./routes/JJlottery');
const expressJWT = require('express-jwt');
const jwt = require("jsonwebtoken");
var cors = require("cors");
const log = require("./config/log");
var { PRIVITE_KEY } = require("./utils/store");
var app = express();



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// 解决跨域
//设置跨域访问
// app.all('*', function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "X-Requested-With");
//     res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
//     res.header("X-Powered-By",' 3.2.1')
//     res.header("Content-Type", "application/json;charset=utf-8");
//     if (req.method === 'OPTIONS') {
//         res.send(204);
//     } else {
//         next();
//     }
// });

// 请求方式判断
// app.use(function (req, res, next) {
//     if (req.method !== "POST") {
//         res.json({status: 404, msg: '您访问的页面不存在！！！'});
//     } else {
//         next();
//     }
// })


Date.prototype.toJSON = function () {
    var timezoneOffsetInHours = -(this.getTimezoneOffset() / 60); //UTC minus local time
    var sign = timezoneOffsetInHours >= 0 ? '+' : '-';
    var leadingZero = (Math.abs(timezoneOffsetInHours) < 10) ? '0' : '';

    //It's a bit unfortunate that we need to construct a new Date instance
    //(we don't want _this_ Date instance to be modified)
    var correctedDate = new Date(this.getFullYear(), this.getMonth(),
        this.getDate(), this.getHours(), this.getMinutes(), this.getSeconds(),
        this.getMilliseconds());
    correctedDate.setHours(this.getHours() + timezoneOffsetInHours);
    var iso = correctedDate.toISOString();//.replace('Z', '').replace('T',' ').replace(/\.[\d]+/g,'');

    return iso;
};

app.use(function (err,req,res,next) {
    res.json({status:400,msg:"数据处理时出现问题，请重试！！！"})
})

app.use(expressJWT({
    secret: PRIVITE_KEY,
    algorithms:['HS256'],
    credentialsRequired:true
}).unless({
    path: ['/login','/text/view','/weather','/getLocation','/region','/lottery'] // 白名单,除了这⾥写的地址，其他的URL都需要验证
}));

// 添加请求日志
app.all("*", async (req, res, next) => {
    //响应开始时间
    const start = new Date();
    //响应间隔时间
    var ms;
    try {
        //开始进入到下一个中间件
        await next();
        //记录响应日志
        ms = new Date() - start;
        log.i(req, ms);
    } catch (error) {
        //记录异常日志
        ms = new Date() - start;
        log.e(req, error, ms);
    }
    console.log(`${req.method} ${req.url} - ${ms}ms-${res.statusCode}`);
});

app.use('/region', regionRouter);
app.use('/eee', indexRouter);
app.use('/user', AddUser);
app.use('/login', login);
app.use('/text', textRouter);
app.use('/file', fileRouter);
app.use('/lottery', JJlotteryRouter);

app.use('/weather', weatherRouter);
app.use('/getLocation', LocationRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    res.json({status: 404, msg: "您访问的页面不存在！"})
});

// error handler
app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        // 这个需要根据⾃自⼰己的业务逻辑来处理理
        res.status(401).send({status:-1,msg:'token验证失败'});
    }else {
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};
        // console.log(err.status)
        // render the error page
        res.status(err.status || 500);
        res.send({status:-1,msg:'系统异常，请稍后重试！'});
        // res.render('error');
    }
});



module.exports = app;
