var request = require("request");

function load() 
{
    var sums = [];
    var names = [];
    var s = 0;
    var n = 0;
    var suma = 0;
    for(var d = 1 ; d <= 460 ; d++)
    {
        request('https://api-v3.mojepanstwo.pl/dane/poslowie/'+d+'.json?&layers[]=wydatki', function (error, response, body) {
        var json = JSON.parse(body);
        //console.log(json.data["ludzie.nazwa"]);
        names.push(json.data["ludzie.nazwa"]);
        //console.log(json.layers.wydatki.roczniki[0].pola);

        if(json.layers.wydatki.roczniki[0] != undefined) var p1 = json.layers.wydatki.roczniki[0].pola;
        if(json.layers.wydatki.roczniki[1] != undefined) var p2 = json.layers.wydatki.roczniki[1].pola;
        if(json.layers.wydatki.roczniki[0] != undefined) 
        {
            for(var i in p1)
            {
                suma += parseInt(p1[i]);
            }
        }
        if(json.layers.wydatki.roczniki[1] != undefined)
        {
            for(var i in p2)
            {
                suma += parseInt(p2[i]);
            }
        }
        console.log(json.data["ludzie.nazwa"] + " sum: " + suma);
        sums.push(suma);
        suma = 0;
        });
    }
    for(var e = 0 ; e <= 460 ; e++)
    {
        //console.log(names[e] + " sum: " + sums[e]);
    }
}

var express = require('express'),
    logger = require('morgan');
var app = express();

app.use(logger('dev'));
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    load();
})

app.listen(3000, function() {
    console.log('Aplikacja jest dostępna na porcie 3000');
})