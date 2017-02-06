var exphbs = require('express-handlebars');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var express = require('express');
var index = require('./routes/index');
var app = express();
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/cats');

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', index.home);
app.get('/cats/new',index.new_cat);
app.get('/cats',index.age_cat);
app.get('/cats/bycolor',index.by_color);
app.param(['color'], index.color_cat);
app.get('/cats/bycolor/:color', function (req,res,next){
	next();
});
app.get('/cats/delete/old',index.old_cat);
app.get('/cats/delete/med',index.med_cat);

app.listen(3002);
