var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var ejs = require('ejs'); //解析html

var index = require('./routes/index');
var users = require('./routes/users');
var goods = require('./routes/goods');

var app = express();

// 修改读取html
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.html', ejs.__express)
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/goods', goods);

// 拦截操作，拦截不登陆前的非法操作
app.use(function (req,res,next) {
  // 有userId说明登录了，所以可以继续
  if (req.cookies.userId) {
    next ();
  } else {
    // 地址白名单
    // req.path是的不带参数的请求地址，在前端相当于是location.pathname
    // req.originalUrl是带参数的请求地址，在前端相当于是location.href
    if (req.originalUrl == '/users/login' || req.originalUrl == '/users/logout' || req.path == '/goods/list') {
      next();
    } else {
      res.json ({
        starus: '10001',
        msg: '当前未登录',
        result: ''
      })
    }
  }
})

// catch 404 and forward to error handler
// 捕获404
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
