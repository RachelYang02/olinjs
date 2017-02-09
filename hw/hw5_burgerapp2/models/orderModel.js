var mongoose = require('mongoose');

// Create a Schema
var orderSchema = mongoose.Schema({
  ingredients: [String],
  price: Number,
  done: Boolean
});

module.exports = mongoose.model("finalOrders", orderSchema);
