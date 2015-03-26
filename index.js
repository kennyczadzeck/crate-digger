var Express = require('express');
var app = Express();
var path = require('path');
var gracenote = require('./myModules/gracenote');

// Serve public files
app.use(Express.static(__dirname + '/public/'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Route to show homepage
app.get('/', function(req, res) {
    res.render('index');
});

// Route to serve new data
app.get('/new', function(req, res) {
  gracenote.search(function(results) {
    res.send(results);
  })
})

var port = "8080";
var server = app.listen(port);
console.log('Example app listening at http://127.0.0.1:%s', port);