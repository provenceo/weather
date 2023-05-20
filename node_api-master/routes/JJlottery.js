var express = require('express');
var router = express.Router();
// var database = require('../database/db');
// const {default: Axios} = require("axios");

router.post('/', function(req, res, next) {

    const {default: Axios} = require("axios");

    let header = {
        "accept-encoding": "gzip, deflate, br",
        "cookie":req.body.iscookie
    }

    function postlottery() {
        var url = "https://api.juejin.cn/growth_api/v1/lottery/draw";
        //获取这个接口的信息
        return Axios.post(url,{},{headers:header});
    }
    //403 7003
    let Request = []
    let timer = 10;
    let result = []
    AllAxios=()=>{
        for (let i = 0; i < timer; i++) {
            Request.push(postlottery())
        }

        Promise.all(Request).then(ress=>{
            ress.forEach(item=>{
                result.push(item.data)
            })
            res.json(result)
        })
    }
    AllAxios()

    // postlottery().then(success=>{
    //     res.json(success.data)
    // }).catch(err=>{
    //     res.json({status:400,msg:err})
    // })
    // database.query("select id, username,createTime from users  where id=?",[req.user.id]).then((results,fields)=>{
    //     res.json({status:200,results})
    // }).catch(_=>{
    //     res.json({status:400,msg:"查询失败，请稍后再试！！"})
    // });

});

module.exports = router;