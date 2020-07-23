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
     * @param question
     * @returns {string}
     */
    link: function(question) {
        return 'https://www.quora.com/' + question;
    },

    list: function (req, res) {
        (async () => {
            const browser = await puppeteer.launch({
                headless: true,
                args: ['--no-sandbox']
            });
            const page = await browser.newPage();
            try {
                await page.goto(this.link(req.param('question')));

                await page.addScriptTag({path: './jquery.js'});

                await page.evaluate(() => {
                    window.scrollTo(0, 1500)
                });

                await page.waitFor(3000);

                await page.evaluate(() => {
                    $('.ui_section_footer').parent().click();
                })

                await page.waitFor(3000);

                await page.evaluate(() => {    //点击【阅读回答】按钮
                    $("[class='q-text qu-flex--auto puppeteer_test_button_text qu-medium']").each(function () {
                        $(this).click()
                    });
                });

                await page.waitFor(5000);

                let answers = await page.evaluate(() => {
                    let answers = new Array();
                    $("[class='q-box qu-pt--medium qu-pb--medium']").each(function (index, item) {
                        let user = $(this).find('.qu-alignSelf--center').find('a').eq(0).text();
                        let content = $(this).find('.qu-userSelect--text').html();
                        if (user !== undefined && content !== undefined) {
                            answers[index] = {};
                            answers[index].user_name = user;    //用户昵称
                            answers[index].user_link = $(this).find('.qu-alignSelf--center').find('a').attr('href');    //用户主页地址
                            answers[index].user_credential = $(this).find('.qu-alignSelf--center').find('.qu-borderWidth--retinaOverride').text();     // 用户认证信息
                            answers[index].user_avatar = $(this).find('img').attr('src');     // 用户头像
                            answers[index].user_info = '';     // 用户住址等信息
                            answers[index].content = content     // 回答内容
                        }
                    });
                    return answers;
                });
                await browser.close();
                data.answers(answers, req.param('question_id'))
            } catch (e) {
                console.log(e)
                await browser.close();
            }
        })();

        jsonWrite(res, true);
    }
}

