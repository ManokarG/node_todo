const express=require('express');
const app=express();
const morgan = require("morgan");
const path=require('path');
const mongoose=require('mongoose');
const mongoUri = 'mongodb://localhost/'; 
mongoose.connect(mongoUri);
const db = mongoose.connection;

db.on('error', function () {
  throw new Error('unable to connect to database at ' + mongoUri);
});


const PORT=process.env.PORT||8080;

const bodyParser=require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());
app.use(express.static(__dirname+'/public/html'));
app.use(express.static(__dirname+'/public'));
app.use(express.static(__dirname+'/public'));


app.use(require('./route'));
app.use(morgan('dev'));

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
    res.send('Cannot find the path'+err.message);
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.send('Cannot find the path'+err.message);
});

db.on('open',function(){
  app.listen(PORT,function(){
  console.log("App listening on port "+PORT);
})
})