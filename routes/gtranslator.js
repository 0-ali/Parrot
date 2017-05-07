var express = require('express');
var router = express.Router();
var GTranslator = require('g-translator');
router.get('/result', function (req, res, next) {
    res.contentType('application/json');
    if(!req.query.q || !req.query.tl){
        res.status(400);
        res.end(JSON.stringify({error: "a required parameter missed",summary:'bad request'}));
    }
    new GTranslator({q: req.query.q, tl: req.query.tl, sl: req.query.sl || 'auto'}, function (gres) {
        res.end(JSON.stringify(gres));
    }, function (e) {
        res.status(400);
        res.end(JSON.stringify({error: e,summary:'technical error'}));
    });
});

module.exports = router;
