var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var productScehma = new Schema({
  "productId": String,
  "productName": String,
  "salePrice": Number,
  "productImage": String,
  "checked": String,
  "productNum": String
});

module.exports = mongoose.model('Good',productScehma);
