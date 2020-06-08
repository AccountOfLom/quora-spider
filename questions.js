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
    link: function(topic) {
        return 'https://www.quora.com/topic/' + topic + '?q=' + topic + '';
    },

    list: function (req, res) {
        (async () => {
            const browser = await puppeteer.launch({
                headless: true,
                args: ['--no-sandbox']
            });
            const page = await browser.newPage();

            await page.goto(this.link(req.param('topic')));

            await page.addScriptTag({path: './jquery.js'});

            await page.waitFor(5000);

            let questions = await page.evaluate(() => {
                let questions = new Array();
                $(".spacing_log_answer_content").each(function (index, item) {
                    let text = $(this).prev().find('a').find('span').text();
                    if (text !== undefined) {
                        questions[index] = {};
                        questions[index].text = text
                    }
                    let link = $(this).prev().find('a').attr('href');
                    if (link !== undefined) {
                        questions[index].link = link
                    }
                });
                return questions;
            });

            await browser.close();

            data.questions(questions, req.param('topic'))

        })();

        jsonWrite(res, true);
    }
}
