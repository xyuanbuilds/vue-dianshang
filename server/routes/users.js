var express = require('express');
var router = express.Router();

var User = require('./../models/users')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// 登录接口
router.post("/login", function (req,res,next) {
  var param = {
    userName: req.body.userName,
    userPwd: req.body.userPwd
  }
  User.findOne (param, function (err, doc) {
    if (err) {
      res.json ({
        status: "1",
        msg: err.message
      })
    } else {
      if (doc) {
        // 存储cookie
        res.cookie("userId", doc.userId,{
          path:'/',
          maxAge: 1000*60*60
        })
        // 存储session
        // req.session.user = doc
        res.json ({
          status: '0',
          msg: '',
          result: {
            userName: doc.userName
          }
        })
      }
    }
  })
})

// 登出接口
// 因为没有去做数据库的交互，所以相对简单
router.post("/logout", function (req,res,next) {
  res.cookie("userId", "",{
    path: "/",
    maxAge: -1
  })
  res.json({
    status: "0",
    msg: '',
    result: ''
  })
})
module.exports = router;
