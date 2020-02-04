var express = require('express');
var router = express.Router();
var cookie = require('cookie');
var io = null;

var pitanje=[];

function dodajPitanje(pitanje) {
  var s = "";
  for (var i=0; i<pitanje.length; i++) {
    s += pitanje[i];
    s += "\n";
  }
  return s;
}

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


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Login' });
});

router.post('/',function (req,res,next) {
  var username=req.body.username;
  var pass=req.body.pass;

  pool.connect(function (err,client,done) {
    if(err){
      res.sendStatus(500);
    }
    client.query("select naziv,predmet.sifra from predmet inner join profesor p on predmet.profesor_id = p.id " +
        "where p.ime=$1;",[username], function (err,result) {
          done();
          if(err){
            res.sendStatus(400);
          } else {
            res.render('profesor',{
              title:'Predavanja',
              predmeti:result.rows
            });
          }
    });
  });
});

router.get('/anketa/:sifra', function(req, res, next) {
  var sifra=req.params.sifra;
  console.log(sifra);
  pool.connect(function (err,client,done) {
    if(err){
      res.sendStatus(500);
    }

    client.query("select * from pitanje", function (err,result) {
      done();

      if(err){
        res.sendStatus(400);
      } else{
        res.render('anketa', {
          title:'Pitanja',
          pitanja:result.rows
        });
      }

    });

  });
});

router.post('/anketa/:id',function (req,res,next) {
  var id=req.params.id;
  pool.connect(function (err, client, done) {
    if (err) {
      res.end('{"error" : "Error",' +
          ' "status" : 500}');
    }

    client.query("UPDATE pitanje " +
        "SET dodan = not dodan WHERE id = $1;",
        [id],
        function (err, result) {
          done();

          if (err) {
            console.info(err);
            res.sendStatus(400);
          } else {
            res.sendStatus(200);
          }
        });
  });
});

router.post('/dodaj/:p', function(req, res, next) {
  var p=req.params.p;
  console.log(p);
  pool.connect(function (err, client, done) {
    if (err) {
      res.end('{"error" : "Error",' +
          ' "status" : 500}');
    }

    client.query("insert into pitanje (pitanje) values ($1);",[p],
        function (err, result) {
          done();

          if (err) {
            console.info(err);
            res.sendStatus(400);
          } else {
            res.sendStatus(200);
          }
        });
  });
});

router.get('/pitanja', function (req,res,next) {
  pool.connect(function (err,client,done) {
    if(err){
      res.sendStatus(500);
    }

    client.query("select * from pitanje where dodan=TRUE;", function (err,result) {
      done();

      if(err){
        res.sendStatus(400);
      } else{
        res.render('pitanja', {
          title:'Pitanja',
          p:result.rows
        });
      }

    });

  });
  if (!io) {
    io = require('socket.io').
    listen(req.connection.server);
    io.sockets.on('connection', function (client) {
      client.emit('msg', dodajPitanje(pitanje));

      client.on('disconnect', function () {
        console.log('disconnected event');
      });

      client.on('msgcl', function (data) {
        pitanje.push(data);
        io.emit('msg', data);
      });
    });
  }

  //res.redirect('pitanja');
});

module.exports = router;
