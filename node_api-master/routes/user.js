const express = require('express');
const database = require('../database/db');
const router = express.Router();
const crypto = require("crypto") // 导入加密模块

const schedule = require("node-schedule");
// 用于新建用户
const queryUserNameSql = "select * from users where username=?"
const insertSql = "insert into users(username,password) VALUES(?,?)"
// 用于修改密码
const queryPassSql = "select password,is_lock from users where id=?"
const updatepassSql = "update users set password = ? where id = ?"
const lockSql = "update users set is_lock = ? where id = ?"
const resetLockSql = "update users set is_lock = ?"
// 用于修改用户
const updateuserSql = "update users set username = ? where id = ?"
// 用于删除用户
const deleteSql = "delete from users where id = ?"
// 创建定时任务每天重置修改密码次数
schedule.scheduleJob('00 19 18 * * *', () => {
    database.query(resetLockSql, [3]).then(_res => {
        console.log(_res)
    }).catch(_err => {
        console.log(_err)
    })
});

router.post('/',(req,res)=>{
    let username = req.body.username;
    database.query(queryUserNameSql,[username]).then(result => {
        res.json({status: 200, msg: "查询成功", data: result})
    })
});



// 新建用户
router.post('/AddUser', function (req, res) {
    let md5 = crypto.createHash("md5");
    let password = md5.update(req.body.password).digest("hex");
    let username = req.body.username;
    let birth = req.body.birth;
    let sex = req.body.sex;
    database.query(queryUserNameSql, [username]).then(result => {
        if (result.length > 0) {
            res.json({status: 400, msg: "用户名重复了，请再次尝试。"})
        } else {
            database.query(insertSql, [username, password]).then(_ => {
                res.json({status: 200, msg: "新建用户成功"})
            }).catch(_ => {
                res.json({status: 400, msg: "新建用户失败"})
            });
        }
    }).catch(_ => {
        res.json({status: 400, msg: "新建用户失败"})
    });
});
// 修改用户
router.post('/UpdateUser', function (req, res) {
        let username = req.body.username;
        let birth = req.body.birth;
        let sex = req.body.sex;

        database.query(updateuserSql, [username,req.user.id]).then(_ => {
            res.json({status: 200, msg: "修改用户成功"})
        }).catch(_ => {
            res.json({status: 400, msg: _})
        });

});
// 修改用户密码
router.post('/UpdatePass', function (req, res) {
        const crypto = require('crypto');
        let Lastpw = crypto.createHash("md5").update(req.body.LastPassWord).digest("hex");
        let newPw = crypto.createHash("md5").update(req.body.NewPassWord).digest("hex");
        let LastPassWord = null;
        let lockNum = null;
        console.log( database.query(queryPassSql, [req.user.id]))
        database.query(queryPassSql, [req.user.id]).then(_ => {
            console.log(_)
            LastPassWord = _[0].password;
            lockNum = _[0].is_lock;
            if (LastPassWord === Lastpw && lockNum === 0) {
                if(LastPassWord==newPw){
                    res.json({status: 400, msg: "新密码不能与原密码相同！！！"})
                    return
                }
                database.query(updatepassSql, [newPw, req.user.id]).then(_res => {
                    res.json({status: 200, msg: "修改密码成功"})
                }).catch(_err => {
                    res.json({status: 400, msg: _err})
                });
            } else {
                if (lockNum !== 0) {
                    database.query(lockSql, [lockNum - 1, req.user.id]).then(_res => {
                        res.json({
                            status: 200,
                            msg: `原密码输入错误，今日还可尝试${lockNum - 1 == 2 ? '三' : lockNum - 1 == 1 ? '二' : '一'}次`
                        })
                    }).catch(_ => {
                        res.json({status: 400, msg: _})
                    })
                } else {
                    res.json({status: 400, msg: "密码连续输入错误三次，今日修改次数已达上限，请明日再试！"})
                }

            }
        }).catch(_ => {
            res.json({status: 400, msg: _})
        })

});
// 删除用户
router.post('/DelUser', function (req, res) {
        database.query(deleteSql, [req.user.id]).then(_ => {
            res.json({status: 200, msg: "用户删除成功！"})
        }).catch(_ => {
            res.json({status: 200, msg: "用户删除失败或用户不存在！"})
        });

});

module.exports = router;