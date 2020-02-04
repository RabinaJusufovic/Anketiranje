var express = require('express');
var router = express.Router();
var cookie = require('cookie');

var config= {
    user: 'axjlzwjh',
    database: 'axjlzwjh',
    password: 'Liags682n1qU2HwFVlwWo0UafdVHTRr_',
    host: 'rajje.db.elephantsql.com',
    port: 5432,
    max:100,
    idleTimeoutMillis: 30000
};

var pg=require('pg');
var pool=new pg.Pool(config);

router.get('/', function(req, res, next) {
    res.render('studentL', { title: 'Login' });
});

router.post('/',function (req,res,next) {
    var username=req.body.user;
    var pass=req.body.password;

    pool.connect(function (err,client,done) {
        if(err){
            res.sendStatus(500);
        }
        client.query("select odgovor from odgovor\n" +
            "inner join student s on odgovor.student_id = s.id\n" +
            "where s.ime=$1;",[username], function (err,result) {
            done();
            if(err){
                res.sendStatus(400);
            } else {
                res.render('odgovori',{
                    odg:result.rows
                });
            }
        });
    });
});

module.exports=router;