var express = require('express');
var router = express.Router();
var Kitty = require('../models/catModel.js');

// function that constructs and returns cat object
function RandoCat(){
  names = ["Bob","Joe","Mr. Kittens","Fluffy","Snoop Dog"];
  ages = ["1","15","60","5","0.5"];
  colors = ["blue","ginger","marbled","white","black"];
  var cat = new Kitty ( {
    name: names[Math.floor(Math.random() * 5)],
    age: ages[Math.floor(Math.random() * 5)],
    color: colors[Math.floor(Math.random() * 5)]
  });
  return cat;
}

// home page, links to extension pages
var home = function (req,res) {
  res.render("home", {"pages": [
    {name:"/cats/new",label:"ADD A CAT"},
    {name:"/cats",label:"CHECK OUT OUR CATS"},
    {name:"/cats/bycolor/:color",label:"SEARCH CATS BY COLOR"},
    {name:"/cats/delete/old",label:"DELETE OLDEST CAT"},
    {name:"/cats/delete/med",label:"DELETE MEDIAN CATS"}]
  });
};

// creates new cat record by random
var new_cat = function (req, res) {
  newest_cat = RandoCat()
  newest_cat.save(function (err) {
    if (err) {
      console.log("Problem saving new cat", err);
    }
  });
  res.render("home", {"pages": [
    {name:"/cats/new",label:"ADD A CAT"},
    {name:"/cats",label:"CHECK OUT OUR CATS"},
    {name:"/cats/bycolor",label:"SEARCH CATS BY COLOR"},
    {name:"/cats/delete/old",label:"DELETE OLDEST CAT"},
    {name:"/cats/delete/med",label:"DELETE MEDIAN CATS"},
    {message:"Added a new cat! Say hello to " + newest_cat.name +
    ", who is " + newest_cat.color + " and " +
    newest_cat.age + " years old."}]
  });
};

// sorts list of cats by age
var age_cat = function (req,res) {
  var msg = "";
  Kitty.find(function (err,indCat) {
    if (err) {
      console.log("Problem finding cats", err);
    }
    indCat.sort(function(a,b) {
      return parseFloat(a.age) - parseFloat(b.age);
    });
    indCat.forEach(function(gato) {
      msg += "name: " + gato.name + ", color: " + gato.color
      + ", age: " + gato.age + " | ";
    });
    res.render("home", {"pages": [
      {name:"/cats/new",label:"ADD A CAT"},
      {name:"/cats/bycolor",label:"SEARCH CATS BY COLOR"},
      {name:"/cats/delete/old",label:"DELETE OLDEST CAT"},
      {name:"/cats/delete/med",label:"DELETE MEDIAN CATS"},
      {message: "Current cat inventory: " + indCat.length},
      {message:msg}]
    });
  });
};

// creates a home page for different cat colors to search by
var by_color = function (req,res) {
  res.render("home", {"pages":  [
    {name:"/cats/new",label:"ADD A CAT"},
    {name:"/cats",label:"CHECK OUT OUR CATS"},
    {name:"/cats/delete/old",label:"DELETE OLDEST CAT"},
    {name:"/cats/delete/med",label:"DELETE MEDIAN CATS"}],
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
  var filter = [];
  var msg = "";
  Kitty.find(function (err,indCat) {
    if (err) {
      console.log("Problem finding cats", err);
    }
    indCat.sort(function(a,b) {
      return parseFloat(a.age) - parseFloat(b.age);
    });
    indCat.forEach(function(gato) {
      if (gato.color == value) {
        filter.push(gato);
      }
    });
    filter.forEach(function(cat){
      msg = msg + "name: " + cat.name + ", color: " + cat.color
      + ", age: " + cat.age + " | ";
    });
    res.render("home", {"pages": [
      {name:"/cats/new",label:"ADD A CAT"},
      {name:"/cats",label:"CHECK OUT OUR CATS"},
      {name:"/cats/delete/old",label:"DELETE OLDEST CAT"},
      {name:"/cats/delete/med",label:"DELETE MEDIAN CATS"},
      {message:msg}]
    });
  });
};

// deletes record of oldest cat
var old_cat = function (req,res) {
  var msg = "";
  Kitty.find(function (err,indCat) {
    if (err) {
      console.log("Problem finding cats", err);
    }
    indCat.sort(function(a,b) {
      return parseFloat(a.age) - parseFloat(b.age);
    });
    var last = indCat.length - 1;
    var last_cat = indCat.splice(last,1)[0];
    Kitty.find({'name':last_cat.name, 'color':last_cat.color, 'age':last_cat.age}).remove(function (err) {
      if (err) {
        console.log("Problem finding last cat", err);
      }
    });
    res.render("home", {"pages": [
      {name:"/cats/new",label:"ADD A CAT"},
      {name:"/cats",label:"CHECK OUT OUR CATS"},
      {name:"/cats/bycolor",label:"SEARCH CATS BY COLOR"},
      {name:"/cats/delete/med",label:"DELETE MEDIAN CATS"},
      {message:"Deleted the oldest cat! RIP " + last_cat.name}]
    });
  });
};

// deletes record of all cats that aren't the
// youngest or oldest by age using Mongoose Query
var med_cat = function (req,res) {
  Kitty.find(function (err,indCat) {
    if (err) {
      console.log("Problem finding cats", err);
    }
    indCat.sort(function(a,b) {
      return parseFloat(a.age) - parseFloat(b.age);
    });
    var last_cat = indCat.splice(indCat.length - 1,1)[0];
    var first_cat = indCat.splice(indCat[0],1)[0];
    Kitty.find({$nor: [ {age:first_cat.age}, {age:last_cat.age} ]}).remove(function (err) {
      if (err) {
        console.log("Problem finding median cats", err);
      }
    });
    res.render("home", {"pages": [
      {name:"/cats/new",label:"ADD A CAT"},
      {name:"/cats",label:"CHECK OUT OUR CATS"},
      {name:"/cats/bycolor",label:"SEARCH CATS BY COLOR"},
      {name:"/cats/delete/old",label:"DELETE OLDEST CAT"},
      {message:"Deleted all cats that aren't the youngest or oldest!"}]
    });
  });
};

module.exports = router;
module.exports.home = home;
module.exports.new_cat = new_cat;
module.exports.age_cat = age_cat;
module.exports.by_color = by_color;
module.exports.color_cat = color_cat;
module.exports.old_cat = old_cat;
module.exports.med_cat = med_cat;
