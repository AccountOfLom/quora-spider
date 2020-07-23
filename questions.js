const puppeteer = require('puppeteer');
let data = require('./data.js');


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

module.exports = {
    /**
     * 获取话题页面链接
     * @param topic
     * @returns {string}
     */
    link: function (topic) {
        return 'https://www.quora.com/topic/' + topic + '?q=' + topic + '';
    },

    list: function (req, res) {
        (async () => {
            const browser = await puppeteer.launch({
                headless: true,
                args: ['--no-sandbox']
            });
            const page = await browser.newPage();
            try {
                await page.goto(this.link(req.param('topic')));

                await page.addScriptTag({path: './jquery.js'});

                await page.waitFor(5000);

                var questions = await page.evaluate(() => {
                    let questions = new Array();
                    $(".spacing_log_answer_content").each(function (index, item) {
                        let text = $(this).prev().find('a').find('span').text();
                        if (text === undefined) {
                            return true;
                        }
                        let link = $(this).prev().find('a').attr('href');
                        if (link === undefined) {
                            return true
                        }
                        questions[index] = {};
                        questions[index].text = text
                        questions[index].link = link

                    });
                    return questions;
                });
                await browser.close();
            } catch (e) {
                console.log(e)
                await browser.close();
            }

            let keywordsArr;
            let keywords = req.param('keywords');
            if (keywords !== '' && keywords !== undefined) {
                keywordsArr = keywords.split(",");
            }
            console.log(keywordsArr);

            if (keywordsArr !== undefined) {
                var result = new Array();
                questions.forEach((question, index, array) => {
                    let hasKeyword = false;
                    keywordsArr.forEach((keyword) => {
                        if (question.text.indexOf(keyword) !== -1) {
                            hasKeyword = true;
                        }
                    })
                    if (hasKeyword) {
                        result = questions[index]
                    }
                })
            console.log('keywords spliced');
            } else {
                var result = questions;
            }
            data.questions(result, req.param('topic'))

        })();

        jsonWrite(res, true);
    }
}

