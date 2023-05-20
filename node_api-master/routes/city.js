const express = require('express');
const router = express.Router();
const crypto = require("crypto") // 导入加密模块
const database = require('../database/db');
const querySql = "select * from location where Area=?"
const insertSql = "insert into location(Area) VALUES(?)"

router.post('/',function (req,res,next) {
    const {default: Axios} = require("axios");
    console.log(req.body.city)
    let md5 = crypto.createHash('md5');
    let md5Hash = md5.update(`/ws/geocoder/v1?key=KMCBZ-BNQRV-N3WPC-URFZ7-O4533-MBBFT&location=${req.body.city}OA2r43faEmcasfW5o1pZ2ApenKxhG`).digest("hex");
    function getLocation() {
        let url = `https://apis.map.qq.com/ws/geocoder/v1?key=KMCBZ-BNQRV-N3WPC-URFZ7-O4533-MBBFT&location=${req.body.city}&sig=${md5Hash}`
        return Axios.get(url)
    }
    let Location = getLocation()
    Location.then(({data})=>{
        let address = data.result.address + data.result.formatted_addresses.rough
        database.query(querySql,[address]).then(_res => {
            if(_res.length===0) {
                database.query(insertSql,[address]).then(_res => {
                    console.log({status: 200, msg: _res})
                }).catch(_err => {
                    console.log({status: 400, msg: _err})
                })
            }
        }).catch(_err => {
            console.log({status: 400, msg: _err})
        })
        res.json({"status":200,data:data.result.ad_info})
    }).catch(err=>{
        res.json({"status":400,"msg":"获取位置失败"})
    })
})

module.exports = router;