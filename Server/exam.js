var express = require('express');

var path = require("path");

var app = express();

app.use(express.static(path.normalize(__dirname) + '/public'));

app.use(function (req, res) {
    res.type('text/plan');
    res.status(404);
    res.send('404 Not Found');
  });

  app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.type('text/plan');
    res.status(500);
    res.send('500 Sever Error');
  });

app.listen(3300);
