var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var argv = require('minimist')(process.argv.slice(2));
var swagger = require("swagger-node-express");
var bodyParser = require( 'body-parser' );

var routes = require('./routes/index');
var user = require('./routes/user');
var article = require('./routes/article');
var event = require('./routes/event');
var association = require('./routes/association');

var app = express();
var subpath = express();

app.use(bodyParser());
app.use("/v1", subpath);

swagger.setAppHandler(subpath);

app.use(express.static('dist'));

swagger.setApiInfo({
  title: "EZPesée SWAGGER",
  description: "Manage your weight",
  termsOfServiceUrl: "",
  contact: "m.remiollivier@gmail.com",
  license: "",
  licenseUrl: ""
});

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/dist/index.html');
});

// Set api-doc path
swagger.configureSwaggerPaths('', 'api-docs', '');

// Configure the API domain
var domain = 'localhost';
if(argv.domain !== undefined)
  domain = argv.domain;
else
  console.log('No --domain=xxx specified, taking default hostname "localhost".')

// Configure the API port
var port = 3000;
if(argv.port !== undefined)
  port = argv.port;
else
  console.log('No --port=xxx specified, taking default port ' + port + '.')

// Set and display the application URL
var applicationUrl = 'http://' + domain + ':' + port;
console.log('snapJob API running on ' + applicationUrl);


swagger.configure(applicationUrl, '1.0.0');


// Start the web server
app.listen(port);

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//app.use(logger('dev'));
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));
//app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', user);
app.use('/associations', association);
//app.use('/article', article);
//app.use('/event', event);
//app.use('/association', association);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
