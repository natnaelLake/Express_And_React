var createError = require('http-errors');
var express = require('express');
var path = require('path');
const cookieParser = require('cookie-parser')
var logger = require('morgan');
var mongoose = require('mongoose')
var cors = require('cors')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const url = ('mongodb+srv://bewuketu:nati1212@expressandreact.uy2sf0r.mongodb.net/?retryWrites=true&w=majority')
const authRouters = require('./authRouter/authRouter')



var app = express();
mongoose.set('strictQuery', false)
mongoose.connect(url)
  .then((result)=>{console.log('mongodb is connected now')})
// view engine setup
// app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: true,
  credentials: true
}))

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use(authRouters)
app.get('/setcookies',(req,res)=>{
  res.cookie('newCookie',false,{maxAge : 1000*60*60*24,httpOnly:true})
  res.send('you got the cookies.')
})
app.get('/readcookies',(req,res)=>{
  
})
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
