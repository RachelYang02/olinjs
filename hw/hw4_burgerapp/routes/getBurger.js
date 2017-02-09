var path = require('path');
var burgerInvent = require('../models/burgerModel.js')

var routes = {};

/*  loads home page
    prints current list of ingredients
*/
routes.ingredients = function(req, res) {
  burgerInvent.find({stock:true},function(err, ingredients) {
    console.log(ingredients);
    res.render('home',{'burgingredients':ingredients});
  });
}

/*  allows user to add new ingredient by input
    saves new ingredient to inventory
    updates printed inventory without refreshing page
*/
routes.addIngred = function(req, res) {
  var newIngred = new burgerInvent ( {
    name: req.body.name,
    price: req.body.price,
    stock: true,
  });
  newIngred.save(function(err) {
    if (err) {
      console.log("Problem adding new ingredient", err);
    };
    burgerInvent.find(function(ingredients) {
      res.send(newIngred);
      return;
    })
  });

};

/*  Out of Stock button
    upon button press, takes ingredient out of inventory
    updates printed inventory without refreshing page
*/
routes.noIngred = function(req, res) {
  burgerInvent.findOne({_id: req.body.id}, function(err, burg) {
    if (err) {
      console.log("Problem loading out-of-stock ingredients", err)
    };
    burg.stock = false;
    burg.save();
  });
  return;
};

/*  Edit button
    upon button press, lets user update name or price of that ingredients
    updates printed inventory without refreshing page
*/
routes.editIngred = function(req, res) {
  burgerInvent.findOne({_id: req.body.id}, function(err,burg) {
    if (err) {
      console.log("Problem editing ingredients", err)
    };
    burg.name = req.body.name;
    burg.price = req.body.price;
    burg.save();
  });
  return;
};

module.exports = routes;
