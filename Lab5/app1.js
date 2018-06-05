var express = require('express'),
    logger = require('morgan');
var app = express();
var x = 1;
var y = 2;

function sum(a, b)
{
    return a + b;
}

app.use(logger('dev'));
app.use(express.static(__dirname + '/public'));

app.get('/add', function(req, res) {;
    res.send('<p>' + x + ' + ' + y + ' = ' + sum(x, y) + '</p>');
})

app.get('/add/:x/:y', function(req, res) {
    x = parseInt(req.params.x);
    y = parseInt(req.params.y);
    //res.send('<p>' + req.params.x + ' + ' + req.params.y + ' = ' + (parseInt(req.params.x) + parseInt(req.params.y)) + '</p>');
    res.send('<p>' + x + ' + ' + y + ' = ' + sum(x, y) + '</p>');
})

app.get('/', function(req, res) {
    res.send('<h1>Witaj Świecie!</h1>');
})

app.listen(3000, function() {
    console.log('Aplikacja jest dostępna na porcie 3000');
})