var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Goods = require('../models/goods');

mongoose.connect('mongodb://127.0.0.1:27017/db_demo');

mongoose.connection.on("connected", function () {
  console.log("MongoDB connect success");
});

mongoose.connection.on("error", function () {
  console.log("MongoDB connect fail");
});

mongoose.connection.on("disconnected", function () {
  console.log("MongoDB connect disconnected");
});

router.get("/", function (req,res,next) {
  // 后台实现分页
  let page = parseInt(req.param("page")); //浏览器参数第几页
  let pageSize = parseInt(req.param("pageSize")); //当前一页多少个
  let sort = req.param("sort"); //前端给的用于判断升序（1）还是降序（-1）
  // 这里设置跳过的数据条数，第一页跳0，第二页跳掉一页的数据，实现分页，这也是分页的基本公式
  let skip = (page - 1)*pageSize;

  // 数据库取到所有数据
  let params = {}; //前端传入的参数集存放
  let goodsModel = Goods.find(params).skip(skip).limit(pageSize); //skip跳过多少条，并limit设置取出多少条

  goodsModel.sort({'salePrice':sort}); //对金额进行排序
  goodsModel.exec(function (err,doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      });
    } else {
      res.json({
        status: '0',
        msg: '',
        result: {
          count: doc.length,
          list: doc
        }
      })
    }
  })
})

module.exports = router
