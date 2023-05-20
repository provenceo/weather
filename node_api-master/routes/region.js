var express = require('express');
var router = express.Router();
const database = require('../database/db');

const queryprovinceSql = "select * from region"

// 递归省市区
function toTreeData(data,pid=0){
    function tree(id,level=0) {
        level++
        let arr = []
        data.filter(item => {
            return item.p_code === id;
        }).forEach(item => {
            if(tree(item.code).length == 0){
                arr.push({
                    id: item.code,
                    name: item.name,
                    level:level,
                })
            }else {
                arr.push({
                    id: item.code,
                    name: item.name,
                    level:level,
                    children: tree(item.code,level)
                })
            }

        })
        return arr
    }
    return tree(pid)  // 第一级节点的父id，是null或者0，视情况传入
}


router.get('/', function(req, res, next){
    database.query(queryprovinceSql,[]).then(_res => {
       let a = toTreeData(_res,0)
       res.json({status:200,data:a})
    })
});

module.exports = router;