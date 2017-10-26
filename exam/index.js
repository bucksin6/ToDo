var express = require('express'),
config = require('./config/config');    

var app = express();   //app object implements the server in express

require('./config/express')(app, config); //loads the express.js file to configure the server and passes the express app object to it

console.log("Creating HTTP server on port: " + config.port);
require('http').createServer(app).listen(config.port, function () {
console.log("HTTP Server listening on port: " + config.port + ", in " + app.get('env') + " mode");
});