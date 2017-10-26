var express = require('express');

var path = require("path");

var app = express();

//indicates that the public folder contains the html file (to serve static assets)
app.use(express.static(path.normalize(__dirname) + '/public'));

//error handler will send the 404 not found message
app.use(function (req, res) {
    res.type('text/plan');
    res.status(404);
    res.send('404 Not Found');
  });
//error handler will send the 500 server error
  app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.type('text/plan');
    res.status(500);
    res.send('500 Server Error');
  });

app.listen(3300); //turns on the server