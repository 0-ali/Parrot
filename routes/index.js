var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {
        title: 'Parrot - Let\'s talk and Skip the bounds',
        description: 'Parrot is a real-time conversion translator written in javascript, It\'s use Express framework to handle with request and g-translator module for translation service',
        keywords: 'real-time translator,Parrot Translator',
        author: 'Mohammed Ali'
    });
});

module.exports = router;
