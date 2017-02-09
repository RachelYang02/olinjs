var mongoose = require('mongoose');

// Create a Schema
var burgerSchema = mongoose.Schema({
  name: String,
  price: Number,
  stock: Boolean,
  disabled: String
});

module.exports = mongoose.model("burgerInvent", burgerSchema);
