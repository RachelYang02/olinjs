var mongoose = require('mongoose');

// Create a Schema
var burgerSchema = mongoose.Schema({
  name: String,
  price: String,
  stock: Boolean
});

module.exports = mongoose.model("burgerInvent", burgerSchema);
