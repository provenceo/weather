const express = require('express');
const router = express.Router();


function getTimeInfo(nTimeStamps) {
    //转毫秒
    var date = new Date(nTimeStamps * 1000);
    //返回数据
    var retData =
         `${date.getFullYear()}年${date.getMonth() + 1}月`
    return retData;
}

router.post('/',function (req,res,next) {
    const {default: Axios} = require("axios");
    function getWeather() {
        let url = `http://wthrcdn.etouch.cn/weather_mini?city=${encodeURI(req.body.city)}`
        console.log(url)
        return Axios.get(url)
    }
    let weather = getWeather()
    weather.then(({data})=>{
        var myDate = Date.now() / 1000;
        console.log(myDate)
        res.json({"status":200,data:data.data,myDate:getTimeInfo(myDate)})
    }).catch(err=>{
        res.json({"status":400,"msg":"获取天气失败"})
    })
})

module.exports = router;