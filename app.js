let express = require('express');
let questions = require('./questions.js');
let answers = require('./answers.js');

let app = express();

Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "H+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

var this_time = new Date().Format("yyyy-MM-dd HH:mm:ss");

app.get('/', function(req, res) {
    res.send('hello world!');
});

app.get('/questions', function(req, res) {
    console.log(this_time + ': questions seek start');
    questions.list(req, res)
});

app.get('/answers', function(req, res) {
    console.log(this_time + ': answers seek start');
    answers.list(req, res)
});
app.listen(3000);