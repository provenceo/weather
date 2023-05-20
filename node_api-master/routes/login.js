const express = require('express');
const router = express.Router();
const database = require('../database/db');
const crypto = require("crypto") // 导入加密模块
var {PRIVITE_KEY, EXPIRESD} = require("../utils/store")
const jwt = require("jsonwebtoken");
// sql语句
const querySql = "select * from users where username=? and password=?"
/*
* 用户登录模块
*
* */

router.post('/', async (req, res) => {
        let md5 = crypto.createHash("md5");
        const username = req.body.username;
        const password = md5.update(req.body.password).digest("hex")
        let result = await database.query(querySql, [username, password])
        if (result && result.length > 0) {
            let token = jwt.sign({username, password, id: result[0].id}, PRIVITE_KEY,  {expiresIn: EXPIRESD});
            res.json({
                status: 200,
                data:{
                    dashboard: "0",
                    token: token,
                    userInfo:{
                        userId:result[0].id,
                        userName:username,
                    }
                },
                msg: '登录成功！'
            })
        } else {
            res.json({status: 400, msg: '登录失败！用户名或密码错误！！！'})
        }
});

module.exports = router;
