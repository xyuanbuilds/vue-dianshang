var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  "userId": String,
  "userName": String,
  "userPwd": String,
  "orderList": [
    {
      "orderId": String,
      "orderTotal": String,
      "addressInfo": {
        "addressId" : String,
        "userName" : String,
        "streetName" : String,
        "postCode" : Number,
        "tel" : Number,
        "isDefault" : Boolean
      },
      "goodsList": [
        {
          "productId": String,
          "productName": String,
          "salePrice": Number,
          "productImage": String,
          "checked": String,
          "productNum": String
        }
      ],
      "orderStatus": String,
      "creatDate": String
    }
  ],
  "cartList":[
    {
      "productId": String,
      "productName": String,
      "salePrice": String,
      "productImage": String,
      "checked": String,
      "productNum": String
    }
  ],
  "addressList": [
    {
      "addressId" : String,
      "userName" : String,
      "streetName" : String,
      "postCode" : Number,
      "tel" : Number,
      "isDefault" : Boolean
    }
  ]
});

module.exports = mongoose.model("User",userSchema);
