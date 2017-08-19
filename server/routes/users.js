var express = require('express');
var router = express.Router();
require('./../util/util')

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
        res.cookie("userName", doc.userName,{
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
// 只需将cookie值置空就可以脱离登录状态了，然后将信息传至前台
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

// 检验当前用户信息
// 用于刷新时保存信息
// 并持续置于已登录状态（其实浏览器会自己保存cookies）
router.get('/checkLogin', function (req,res,next) {
  if (req.cookies.userId) {
    res.json({
      status: '0',
      msg: '',
      result: req.cookies.userName
    })
  } else {
    res.json({
      status: '1',
      msg:'没登',
      result: ''
    })
  }
})

// 查询当前用户的购物车
router.get('/cartList', function (req,res,next) {
  var userId = req.cookies.userId;
  User.findOne({userId:userId}, function (err,doc) {
    if (err) {
      res.json ({
        status: "1",
        msg: err.message,
        result:''
      })
    } else {
      if (doc) {
        res.json ({
          status: '0',
          msg: '',
          result: doc.cartList
        })
      }
    }
  })
})

//删除用户名下购物车的数据
// req的取值在get中用param，post中用body
router.post('/cartDel', function (req,res,next) {
  var userId = req.cookies.userId, productId = req.body.productId;
  User.update({
    userId:userId
  }, {
    $pull: {
      'cartList': {
        'productId': productId
      }
    }
  }, function (err,doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result:''
      })
    } else {
      res.json ({
        status: '0',
        msg: '',
        result: 'suc'
      })
    }
  })
})

// 购物车商品数量修改
router.post('/cartEdit', function (req,res,next) {
  var userId = req.cookies.userId,
      productId = req.body.productId,
      productNum = req.body.productNum,
      checked = req.body.checked

  User.update({
    "userId":userId,
    "cartList.productId":productId
  }, {
    "cartList.$.checked":checked,
    "cartList.$.productNum":productNum,
  }, function (err,doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result:''
      })
    } else {
      res.json({
      status: '0',
      msg: '',
      result: 'suc'
      })
    }
  })
})

// 全选功能
router.post('/editCheckAll', function (req,res,next) {
  var userId = req.cookies.userId,
      checkAll = req.body.checkAll?'1':'0'

  User.findOne({"userId":userId}, function (err,user) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result:''
      })
    } else {
      if (user) {
        user.cartList.forEach((item)=>{
          item.checked = checkAll
        })
      }
      user.save(function (err1,doc) {
        if (err1) {
          res.json({
            status: '1',
            msg: err1.message,
            result:''
          })
        } else {
          res.json({
            status: '0',
            msg: '',
            result:'suc'
          })
        }
      })
    }
  })
})

//查询用户地址接口
router.get('/addressList', function (req,res,next) {
  var userId = req.cookies.userId

  User.findOne({"userId":userId}, function (err,doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    } else {
      res.json({
        status: '0',
        msg: '',
        result: doc.addressList
      })
    }
  })
})

// 设置默认地址
router.post('/setDefault', function (req,res,next) {
  var userId = req.cookies.userId,
      addressId = req.body.addressId

  if (!addressId) {
    res.json({
      status: '1003',
      msg: 'address null',
      result: ''
    })
  } else {
    User.findOne({userId:userId}, function (err,doc){
      if (err) {
        res.json({
          status: '1',
          msg: err.message,
          result: ''
        })
      } else {
        var addressList = doc.addressList
        addressList.forEach((item)=>{
          if (item.addressId == addressId) {
            item.isDefault = true
          } else {
            item.isDefault = false
          }
        })
        doc.save(function (err1,doc1) {
          if (err1) {
            res.json({
              status: '1',
              msg: err1.message,
              result: ''
            })
          } else {
            res.json({
              status: '0',
              msg: '',
              result: ''
            })
          }
        })
      }
    })
  }
})

// 删除地址
router.post('/delAddress', function (req,res,next) {
  var userId = req.cookies.userId, addressId = req.body.addressId;
  User.update({
    userId:userId
  }, {
    $pull: {
      'addressList': {
        'addressId': addressId
      }
    }
  }, function (err,doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result:''
      })
    } else {
      res.json ({
        status: '0',
        msg: '',
        result: 'suc'
      })
    }
  })
})

//生成订单
router.post('/payMent', function (req,res,next) {
  var userId = req.cookies.userId,
      orderTotal = req.body.orderTotal,
      addressId = req.body.addressId;

  User.findOne({userId: userId}, function (err,doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result:''
      })
    } else {
      var address = '',
          goodsList= []
      // 获取当前用户地址信息
      doc.addressList.forEach((item)=>{
        if (addressId == item.addressId) {
          address = item
        }
      })
      // 获取用户购物车购买商品
      doc.cartList.filter((item)=>{
        if (item.checked == '1') {
          goodsList.push(item)
        }
      })

      var platform = '622'
      var r1 = Math.floor(Math.random()*10)
      var r2 = Math.floor(Math.random()*10)

      var sysDate = new Date().Format('yyyMMddhhmmss')
      var createDate = new Date().Format('yyyy-MM-dd hh:mm:ss')

      // 创建订单id，一个平台号，两个随机数，一个时间数
      var orderId = platform + r1 + sysDate +r2
      // 生成订单
      var order = {
        orderId: orderId,
        orderTotal: orderTotal,
        addressInfo: address,
        goodsList: goodsList,
        orderStatus: '1',
        creatDate: createDate
      }

      doc.orderList.push(order)

      doc.save(function (err1,doc1) {
        if (err1) {
          res.json({
            status: '1',
            msg: err1.message,
            result:''
          })
        } else {
          res.json ({
            status: '0',
            msg: '',
            result: {
              orderId: order.orderId,
              orderTotal: order.orderTotal
            }
          })
        }
      })
    }
  })
})

// 根据订单id查询订单信息
router.get('/orderDetail', function (req,res,next) {
  var userId = req.cookies.userId, orderId = req.param("orderId");
  User.findOne({userId: userId}, function (err,userInfo) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result:''
      })
    } else {
      var orderList = userInfo.orderList
      if (orderList.length > 0) {
        var orderTotal = 0
        orderList.forEach((item)=>{
          if (item.orderId == orderId) {
            orderTotal = item.orderTotal
          }
        })

        if (orderTotal > 0) {
          res.json ({
            status: '0',
            msg: '',
            result: {
              orderId: orderId,
              orderTotal: orderTotal
            }
          })
        } else {
          res.json ({
            status: '120001',
            msg: '无此订单',
            result: ''
          })
        }
      } else {
        res.json ({
          status: '120001',
          msg: '当前用户无订单',
          result: ''
        })
      }
    }
  })
})

router.get('/getCartCount', function (req,res,next) {
  if (req.cookies && req.cookies.userId) {
    var userId = req.cookies.userId
    User.findOne({userId:userId}, function (err,doc) {
      if (err) {
        res.json ({
          status: '1',
          msg: err.message,
          result: ''
        })
      } else {
        let cartList = doc.cartList
        let cartCount = 0
        cartList.map(function (item) {
          cartCount += parseInt(item.productNum)
        })
        res.json ({
          status: '0',
          msg: '',
          result: cartCount
        })
      }
    })
  }
})
module.exports = router;
