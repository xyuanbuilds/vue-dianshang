var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var productScehma = new Schema({
  "productId": String,
  "productName": Number,
  "salePrice": Number,
  "productImage": String
});

module.exports = mongoose.model('Good',productScehma);
