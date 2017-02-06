var mongoose = require('mongoose');

// Create a Schema
var catSchema = mongoose.Schema({
  name: String,
  age: String,
  color: String
});

module.exports = mongoose.model("CatCollection", catSchema);
