var express = require('express');
var router = express.Router();

router.get('/profesor', function(req, res, next) {
    res.render('profesor', { title: 'Predavanje' });
});

module.exports = router;