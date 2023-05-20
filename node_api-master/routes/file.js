var express = require('express');
var router = express.Router();
var multer = require('multer');
var path = require('path');
var fs = require('fs');

var storage = multer.diskStorage({
    //设置上传后文件路径，uploads文件夹需要手动创建！！！
    destination: function (req, file, cb) {
        cb(null, '/uploads/images')
    },
    //给上传文件重命名，获取添加后缀名
    filename: function (req, file, cb) {
        var fileFormat = (file.originalname).split(".");
        cb(null, file.fieldname + '-' + Date.now() + "." + fileFormat[fileFormat.length - 1]);
    }
});
//添加配置文件到muler对象。
var upload = multer({
    storage: storage
});
router.post('/',function (req,res,next) {
    let arr = []
    let array = []
    fs.readFile(path.join(__dirname,'111.txt'),'utf-8', function (err,data) {
        if(err){
            console.log("error");
        }else{
            console.log(data);
            arr = data.split(/[(\r\n)\r\n]+/)
            arr.forEach((item,index)=>{
                if(!item){
                    arr.splice(index,1);//删除空项
                }
                else {
                    // let strSql = `insert into content(content) VALUES('${item}')`
                    // database.query(strSql).then(_ => {
                    //     console.log(_)
                    // }).catch(_=>{
                    //     console.log(_)
                    // })

                    array.push({id:index+1,content:item})
                }
            })
            res.json({status:200,data:array});
        }
    })
})


router.post('/upload', upload.single('file'), function(req, res, next){
    if (!req.file || Object.keys(req.file).length === 0) {
        res.status(400).send({status:400,msg:"请选择要上传的文件！"});
        return;
    }

    if(res.statusCode===200) res.json({status:200,msg:"文件上传成功"});
    else res.json({status:400,msg:"文件上传失败"})
});

module.exports = router;