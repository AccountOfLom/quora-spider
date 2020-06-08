let express = require('express');
let questions = require('./questions.js');
let answers = require('./answers.js');

let app = express();

app.get('/', function(req, res) {
    res.send('hello world!');
});

app.get('/questions', function(req, res) {
    questions.list(req, res)
});

app.get('/answers', function(req, res) {
    answers.list(req, res)
});
app.listen(3000);