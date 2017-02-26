const express=require('express');
const app=express();
const morgan = require("morgan");
const path=require('path');
const mongoose=require('mongoose');
require('dotenv').config();
const router=express.Router();
const mongoUri = 'mongodb://localhost/Notez';
mongoose.connect(mongoUri);
const db = mongoose.connection;

db.on('error', function () {
  throw new Error('unable to connect to database at ' + mongoUri);
});


const PORT=process.env.PORT||process.env.NODE_PORT;

const bodyParser=require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use('/js',express.static(__dirname+'/public/js'));
app.use('/css',express.static(__dirname+'/public/css'));
app.use(express.static(__dirname+'/public/html'));

app.use(function(req,res,next){
  req.body=JSON.parse(JSON.stringify(req.body));
        req.contains=function(key){
          return this.body.hasOwnProperty(key);
        }
  res.sendSuccess=function(response){
      response.status='success';
      res.json(response);
    };
    res.sendFailure=function(response){
      response.status='error';
      res.json(response);
    };
    next();
})

app.use('/',require('./route'));
app.use(morgan('dev'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error(req.url+' path not found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send(err.message);
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