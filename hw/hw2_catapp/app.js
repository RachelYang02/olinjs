var exphbs = require('express-handlebars');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var express = require('express');
var index = require('./routes/index');
var app = express();

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

//Instead of using app.param, you are directly passing color as a param in your app.get callback, so you could just do app.get('/cats/bycolor/:color', cats.sortedCat); In your routes.js, you can access the params by using req.params.color.
app.get('/cats/bycolor',index.by_color);
app.param(['color'], index.color_cat);
app.get('/cats/bycolor/:color', function (req,res,next){
	next();
});
app.get('/cats/delete/old',index.old_cat);

app.listen(3002);
