var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs  = require('express-handlebars');
var getBurger = require('./routes/getBurger.js');
var burgerInvent = require("./models/burgerModel.js");
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/ingredients');

var index = require('./routes/index');

var app = express();

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/ingredients', getBurger.ingredients);
app.post('/addIngred', getBurger.addIngred);
app.post('/noIngred', getBurger.noIngred);
app.post('/editIngred', getBurger.editIngred);

var PORT = 3000;
app.listen(PORT, function() {
  console.log("App running on port:", PORT);
});
