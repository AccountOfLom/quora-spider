const fs = require('fs')
const path = require('path')

Date.prototype.format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1,                 //月份
        "d+": this.getDate(),                    //日
        "h+": this.getHours(),                   //小时
        "m+": this.getMinutes(),                 //分
        "s+": this.getSeconds(),                 //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}

// 统一生成writeStream
function createWriteStream() {
    const fullFileName = path.join(__dirname, './', 'logs', new Date().format("yyyy-MM-dd") + '.log')
    const writeStream = fs.createWriteStream(fullFileName, {
        flags: 'a' //'a'为追加，'w'为覆盖
    })
    return writeStream
}

// 写入日志
function writeLog (writeStream, log) {
    writeStream.write(log + '\n')
}

// 访问日志的writeStream
const accessWriteStream = createWriteStream()

function write(log) {
    writeLog(accessWriteStream, log)
}

module.exports = {
    write
}
