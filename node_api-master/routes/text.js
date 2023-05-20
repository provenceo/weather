const nodemailer = require("nodemailer");
// 发送邮件函数
const schedule = require("node-schedule");
const express = require('express');
const router = express.Router();
const database = require('../database/db');
const insertSql = "insert into content(content) VALUES(?)"
const queryContentSql = "select * from content order by id desc limit ? , ?"
const querytotalSql = "select count(*) as count from content"
const date = require("silly-datetime");

router.post("/create", function (req, res) {
    database.query(insertSql, [req.body.content]).then(_res => {
        res.json({status: 200, msg: "新建成功！！！"})
    }).catch(_err => {
        res.json({status: 400, msg: _err})
    })
})
router.post("/view", function (req, res) {
    let getClientIp = function (req) {
        return req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress || '';
    };

    console.log(getClientIp(req));
    let ip = getClientIp(req).match(/\d+.\d+.\d+.\d+/);
    console.log(ip);
    ip = ip ? ip.join('.') : null;
    console.log(ip);

    let page = req.body.page || 1;
    let pageSize = req.body.size || 10;
    let count = null
    database.query(querytotalSql,[]).then($res=>{
        count = $res[0].count
        database.query(queryContentSql, [(page - 1)*pageSize, pageSize]).then(_res => {
            _res.forEach(item=>{
                item.create_time=date.format(item.create_time,"YYYY-MM-DD")
            })
            res.json({status: 200, data: _res,total:count,countPage:Math.ceil((count/pageSize))})
        }).catch(_err => {
            res.json({status: 400, msg: _err})
        })
    })

})
module.exports = router;
