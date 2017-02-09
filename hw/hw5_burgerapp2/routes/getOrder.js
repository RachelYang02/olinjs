var path = require('path');
var burgerInvent = require('../models/burgerModel.js');
var finalOrders = require('../models/orderModel.js');

var routes = {};
var total = 0;

/*  loads orders page
    shows a form of ingredients for users to add to order
*/
routes.orders = function(req, res) {
  burgerInvent.find({stock:true},function(err, ingredients) {
    console.log(ingredients);
    res.render('order',{'burgingredients':ingredients});
    return;
  });
}

/*  shows checklist of ingredients
    for users to add to order
    updates total sum of ingredient prices
*/
routes.checkbox = function(req, res) {
  burgerInvent.findOne({_id: req.body.id}, function(err,burg){
    console.log(req.body);
    if (err) {
      console.log("Problem loading ingredients",err);
    };
    if (req.body.state == 'true') {
      total += burg.price;
    }
    else {
      total-= burg.price;
    }
    console.log(total);
    res.send({total:total})
    return;
  });

};

/*  Saves new order list of ingredients
    Saves price of order and resets total to 0
*/
routes.newOrder = function(req, res) {
  var prev_order = req.body.ingredients.split(' ');
  prev_order.splice(-1,1);
  var newOrder = new finalOrders({ingredients: prev_order, price: total});
  total = 0;
  newOrder.save(function(err){
    if (err) {
      console.log("Problem saving new order", err);
    }
  });
};

/*  Shows current list of pending orders
*/
routes.kitchen = function(req, res) {
  finalOrders.find(function(err,orders){
    if (err) {
      console.log("Problem displaying pending orders",err);
    };
    res.render('kitchen',{'order':orders})
  });
}

/*  Removes completed order
*/
routes.removeOrder = function(req, res) {
  finalOrders.findOne({_id: req.body.id}).remove(function(err,burg) {
    if (err) {
      console.log("Problem editing ingredients", err)
    };
  });
};

module.exports = routes;
