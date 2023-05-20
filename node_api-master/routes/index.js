var express = require('express');
var router = express.Router();
var database = require('../database/db')


router.get('/', function(req, res, next) {
            console.log(req.user)
         database.query("select id, username,creattime from users where id=?",[req.user.id]).then((results,fields)=>{
             res.json({status:200,results})
         }).catch(_=>{
             res.json({status:400,msg:"查询失败，请稍后再试1！！"})
         });

});

module.exports = router;
