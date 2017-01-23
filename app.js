var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var busboy = require('connect-busboy'); //middleware for form/file upload
//var io = require('socket.io');

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var dl  = require('delivery')
var fs  = require('fs');

//var wincmd = require("node-windows");




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

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
 

//var exec = require('child_process').exec;
//var cp = require("child_process");
//cp.exec("C:\\Users\\Gabriel\\Desktop\\programas\\hi.rtf"); // notice this without a callback..

//const spawn = require('child_process').spawn;
//const grep = spawn('grep', ['ssh']);

//console.log(`Spawned child pid: ${grep.pid}`);
//grep.stdin.end();

//process.exit(0); // exit this nodejs process

io.on('connection', function(socket){
    // socket.on('disconnect', function(){
    //   console.log('user disconnected');
    // });
    // socket.on('chat message', function(msg){
    // console.log('message: ' + msg);

  var delivery = dl.listen(socket);
  delivery.on('receive.success',function(file){
    var params = file.params;
    var folder = "..\\myapp\\programsToShare3\\"+file.name
    fs.writeFile(folder,file.buffer, function(err){

      if(err){
        console.log('El archivo no pudo ser guardado.');
      }else{
        console.log('Archivo guardado.');
      };

    });
  });

});



http.listen(3000, function (){
	console.log("Empezando Server");
});

module.exports = app;
