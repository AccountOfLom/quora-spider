let mysql = require('mysql')


let jsonWrite = function (res, ret) {
    if (ret === false) {
        res.json({
            code: '1',
            msg: 'error'
        });
    } else {
        res.json({
            code: '0',
            msg: 'success'
        });
    }
};

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

module.exports = {
    db: function () {
        let db = mysql.createConnection({
            host: 'localhost',
            user: 'quora',
            password: 'quora',
            port: '3306',
            database: 'quora'
        });
        return db
    },
    questions: function (questions, topic) {
        let db = this.db();
        db.connect();
        questions.forEach((item, index, array) => {
            db.query('SELECT id from questions where text =' + '"' + item.text + '"', function (err, result) {
                //该问题是否已存储
                if (result.length === 0) {
                    let addSql = 'INSERT INTO questions(topic, text, link, created_at) VALUES(?,?,?,?)';
                    let addSqlParams = [topic, item.text, item.link, new Date().format("yyyy-MM-dd hh:mm:ss")];
                    db.query(addSql, addSqlParams, function (err, result) {
                        if (err) {
                            console.log('[INSERT ERROR] - ', err.message);
                            return;
                        }
                    });
                }
            })
        });
        setTimeout(function () {
            db.end();
        }, 2000)
        return true;
    },
    getQuestionLinkByID: function (id) {
        let db = this.db();
        db.connect();
        db.query('SELECT link from questions where id =' + '"' + id + '"', function (err, result) {
            result.forEach(function (question) {
                link = question.link;
            });
        })
        db.end();
        return true;
    },
    answers: function (answers, questionID) {
        let db = this.db();
        db.connect();
        answers.forEach((item, index, array) => {
            if (item !== null) {
                db.query('SELECT id from answers where user_name =' + '"' + item.user_name + '"', function (err, result) {
                    //该回答是否已存储
                    if (result.length === 0) {
                        let addSql = 'INSERT INTO answers(question_id, user_name, user_link, user_credential, user_avatar, user_info, content, created_at) VALUES(?,?,?,?,?,?,?,?)';
                        let addSqlParams = [questionID, item.user_name, item.user_link, item.user_credential, item.user_avatar, item.user_info, item.content, new Date().format("yyyy-MM-dd hh:mm:ss")];
                        db.query(addSql, addSqlParams, function (err, result) {
                            if (err) {
                                console.log('[INSERT ERROR] - ', err.message);
                                return;
                            }
                        });
                    }
                })
            }
        });
        setTimeout(function () {
            db.end();
        }, 3000)
        console.log('success');
        return true;
    }
}



