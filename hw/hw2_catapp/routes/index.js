var express = require('express');
var router = express.Router();
var db = require('../public/javascripts/fakeDatabase');

// function that constructs and returns cat object
function Cat(){
  names = ["Bob","Joe","Mr. Kittens","Fluffy","Snoop Dog"];
  ages = ["1","15","60","5","0.5"];
  colors = ["blue","ginger","marbled","white","black"];
  var cat = {
    name: names[Math.floor(Math.random() * 5)],
    age: ages[Math.floor(Math.random() * 5)],
    color: colors[Math.floor(Math.random() * 5)]
  };
  return cat;
}

// home page, links to extension pages
var home = function (req,res) {
  res.render("home", {"pages": [
    {name:"/cats/new",label:"ADD A CAT"},
    {name:"/cats",label:"CHECK OUT OUR CATS"},
    {name:"/cats/bycolor/:color",label:"SEARCH CATS BY COLOR"},
    {name:"/cats/delete/old",label:"DELETE A CAT"}]
  });
};

// creates new cat record by random
var new_cat = function (req, res) {
  newest_cat = Cat()
  db.add(newest_cat);
  res.render("home", {"pages": [
    {name:"/cats/new",label:"ADD A CAT"},
    {name:"/cats",label:"CHECK OUT OUR CATS"},
    {name:"/cats/bycolor",label:"SEARCH CATS BY COLOR"},
    {name:"/cats/delete/old",label:"DELETE A CAT"},
    {message:"Added a new cat! Say hello to " + newest_cat.name + 
    ", who is " + newest_cat.color + " and " + 
    newest_cat.age + " years old."}]
  });
};

// sorts list of cats by age
var age_cat = function (req,res) {
  cat_inventory = db.getAll();
  cat_inventory.sort(function(a,b) {
    return parseFloat(a.age) - parseFloat(b.age);
  });
  var msg = ""
  cat_inventory.forEach(function(cat){
    msg = msg + "name: " + cat.name + ", color: " + cat.color
    + ", age: " + cat.age + " | ";
  })
  res.render("home", {"pages": [
    {name:"/cats/new",label:"ADD A CAT"},
    {name:"/cats/bycolor",label:"SEARCH CATS BY COLOR"},
    {name:"/cats/delete/old",label:"DELETE A CAT"},
    {message:"Current cat inventory: " + cat_inventory.length},
    {message:msg}]
  });
};

var by_color = function (req,res) {
  res.render("home", {"pages":  [
    {name:"/cats/new",label:"ADD A CAT"},
    {name:"/cats",label:"CHECK OUT OUR CATS"},
    {name:"/cats/delete/old",label:"DELETE A CAT"}], 
    "color": [
    {name:"/cats/bycolor/blue",label:"BLUE CATS"},
    {name:"/cats/bycolor/ginger",label:"GINGER CATS"},
    {name:"/cats/bycolor/marbled",label:"MARBLED CATS"},
    {name:"/cats/bycolor/white",label:"WHITE CATS"},
    {name:"/cats/bycolor/black",label:"BLACK CATS"}]
  });
}

// sorts list of cats by age with specific color
// filter into sublist of cats with color and sort by age
var color_cat = function (req,res,next,value) {
  cat_inventory = db.getAll()
  var filter = [];
  cat_inventory.forEach(function(gato){
    if (gato.color == value) {
      filter.push(gato);
    }
  })

  var msg = ""
  filter.forEach(function(cat){
    msg = msg + "name: " + cat.name + ", color: " + cat.color
    + ", age: " + cat.age + " | ";
  })
  res.render("home", {"pages": [
    {name:"/cats/new",label:"ADD A CAT"},
    {name:"/cats",label:"CHECK OUT OUR CATS"},
    {name:"/cats/delete/old",label:"DELETE A CAT"},
    {message:msg}]
  });
};

// deletes record of oldest cat
var old_cat = function (req,res) {
  cat_inventory = db.getAll();
  cat_inventory.sort(function(a,b) {
    return parseFloat(a.age) - parseFloat(b.age);
  });
  var last = cat_inventory.length - 1;
  var last_cat = cat_inventory.splice(last,1)[0];
  db.data = cat_inventory;
  res.render("home", {"pages": [
    {name:"/cats/new",label:"ADD A CAT"},
    {name:"/cats",label:"CHECK OUT OUR CATS"},
    {name:"/cats/bycolor",label:"SEARCH CATS BY COLOR"},
    {message:"Deleted the oldest cat! RIP " + last_cat.name}]
  });
};


module.exports = router;
module.exports.home = home;
module.exports.new_cat = new_cat;
module.exports.age_cat = age_cat;
module.exports.by_color = by_color;
module.exports.color_cat = color_cat;
module.exports.old_cat = old_cat;