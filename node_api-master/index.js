const nodemailer = require("nodemailer");
// 发送邮件函数
const schedule = require("node-schedule");
const dayjs = require("dayjs")
const weekday = require('dayjs/plugin/weekday')
const isSameOrAfter = require("dayjs/plugin/isSameOrAfter")
// 使用 dayjs 插件
dayjs.extend(weekday)
dayjs.extend(isSameOrAfter);
const { city, birthday1, birthday2, love_date, renshi_date } = require("./config")
//每天下午5点21分发送
schedule.scheduleJob({hour: 5, minute: 21,seconds:0}, function () {
    getHoneyedWords().then((res) => {
        sendMail(res.data);
    });
});

function getTimeInfo(nTimeStamps) {
    //转毫秒
    var date = new Date(nTimeStamps * 1000);
    //返回数据
    return `${date.getFullYear()}年${date.getMonth() + 1}月`;
}


async function sendMail(text) {
    let user = "zu_sliang@foxmail.com";//自己的邮箱
    let pass = "jxgklkfxtuvlijec"; //qq邮箱授权码,如何获取授权码下面有讲
    let to = "s758@vip.qq.com";//对方的邮箱3159606829@qq.com
    let transporter = nodemailer.createTransport({
        host: "smtp.qq.com",
        port: 587,
        secure: false,
        auth: {
            user: user, // 用户账号
            pass: pass, //授权码,通过QQ获取
        },
    });

    // 获取当前时间：格式 2022年8月25日 星期五
        const getCurrentDate = () => dayjs().format('YYYY-MM-DD') + " " + {
            1: "星期一", 2: "星期二", 3: "星期三", 4: "星期四", 5: "星期五", 6: "星期六", 0: "星期日",
        }[dayjs().weekday()]; // 当前星期几
        
        // 计算生日还有多少天
        const brthDate = brth => {
            // nowTime:当前时间 birthday:今年的生日
            let nowTime = new Date(), birthday = new Date(nowTime.getFullYear(), brth.split('-')[1] - 1, brth.split('-')[2]);
            //今年生日已过，则计算距离明年生日的天数
            if (birthday < nowTime) birthday.setFullYear(nowTime.getFullYear() + 1);
            return Math.ceil((birthday - nowTime) / (24 * 60 * 60 * 1000))
        }
        
        //判断是否为闰年(闰年366天 平年365天)
        const isLeap = year => year % 4 == 0 && year % 100 != 0 || year % 400 == 0 ? true : false;
        
        // 判断是否今天生日
        const get_birthday = user => {
            // let isl = isLeap(new Date().getFullYear());
            let brth = brthDate(user.birthday);
            return brth === 366 || brth === 365 ? `这是属于${user.name}特别的一天，生日快乐🎉🎉` : `距离${user.name}的生日还有${brth}天`;
        }
        
        // 随机颜色
        const randomColor = () => '#' + Math.floor(Math.random() * 0xffffff).toString(16);
    getWeather().then(async ({data})=>{
        console.log(data)
        let together_day = dayjs().diff(love_date, "day"); // 计算在一起的天数
        let rs_day = dayjs().diff(renshi_date, "day"); // 计算在一起的天数
        let birth1 = get_birthday(birthday1);// 生日
        console.log(birth1)
        let birth2 = get_birthday(birthday2);
        let info = await transporter.sendMail({
            from: `来自二宝的早安推送<${user}>`, // sender address
            to: `杜牛牛<${to}>`, // list of receivers
            subject: `杜牛牛💓今天是我们认识的第${rs_day}天（づ￣3￣）づ╭❤～`, // Subject line
            html: ` <div style="height: 100%;display: flex;justify-content: center;align-items: center;flex-direction: column" class="warp">
                       <div style="color: darkred;font-size: 16px;font-family: 'Sitka Text',serif, FangSong">
                           ${text}
                       </div>
                       <div>
                           <div style="font-size: 14px;font-weight:bold;margin-top: 10px">
                              所在城市： <span style="color: red">${data.result.location.city}${data.result.location.name}区</span>
                           </div>
                           <ul style="list-style-type:none">
                               <li style="list-style-type:none;color:${randomColor()}">天气：${data.result.now.text}</li>
                               <li style="list-style-type:none;color:${randomColor()}">当前温度：${data.result.now.temp}</li>
                               <li style="list-style-type:none;color:${randomColor()}">今天是我们在一起的${together_day}天</li>
                               <li style="list-style-type:none;color:${randomColor()}">${birth1}</li>
                               <li style="list-style-type:none;color:${randomColor()}">${birth2}</li>
                           </ul>
                       </div>
                   </div>`
        });
    })
}
const {default: Axios} = require("axios");

function getHoneyedWords() {
    // let url = "https://chp.shadiao.app/api.php";
    let url = "https://api.vvhan.com/api/love";
    //获取这个接口的信息
    return Axios.get(url);
}
function getWeather() {
    // let url = "https://chp.shadiao.app/api.php";
    let url = `https://api.map.baidu.com/weather/v1/?district_id=370213&data_type=all&ak=SaISlfhiqzQEM0TNXrZBSL2HR0h0KI2X`;
    //获取这个接口的信息
    return Axios.get(url);

}
sendMail()

