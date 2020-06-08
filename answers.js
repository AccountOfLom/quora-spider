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

            let s = await page.evaluate(() => {
                let j = 0;
                $(".button_wrapper").each(function () {
                    $(this).click()
                    j++
                });
                return j
            });

            console.log(s);

            await page.waitFor(5000);

            let answers = await page.evaluate(() => {
                let answers = new Array();
                $(".AnswerHeader").each(function (index, item) {
                    let user = $(this).find('.user').text();
                    let content = $(this).parent().next().find('.ui_qtext_expanded').find('.ui_qtext_rendered_qtext').html();
                    if (user !== undefined && content !== undefined) {
                        answers[index] = {};
                        answers[index].user_name = user;    //用户昵称
                        answers[index].user_link = $(this).find('.user').attr('href');    //用户主页地址
                        answers[index].user_credential = $(this).find('.NameCredential').text();     // 用户认证信息
                        answers[index].user_avatar = $(this).find('.ui_avatar_photo').attr('src');     // 用户头像
                        let bio = '';
                        $(this).find('.bio').each(function (index, item) {
                            if (index !== 0) {
                                bio += '，';
                            }
                            bio += $(this).text();
                        });
                        answers[index].user_info = bio;     // 用户住址等信息
                        answers[index].content = content     // 回答内容
                    }
                });
                return answers;
            });

            await browser.close();

            data.answers(answers, req.param('question_id'))

        })();

        jsonWrite(res, true);
    }
}

