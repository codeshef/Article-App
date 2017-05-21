var express=require('express');
var app=express();
var router=express.Router();
var path=require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var Post=require('./models/post');
var routes=require('./routes');
app.listen(8000,function()
	{
		console.log('App is listening at port 8000');
	});
var bodyParser= require('body-parser');
var index=require('./routes/index');
var users=require('./routes/users');

//View engine setup
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
// Require mongoose and connecting with MongoDb
var mongoose=require('mongoose');
mongoose.connect("mongodb://127.0.0.1:27017/article",function(err)
	{
		if(err)
		{
			console.log(err);
		}
		console.log('Connected to database');
		
	});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

