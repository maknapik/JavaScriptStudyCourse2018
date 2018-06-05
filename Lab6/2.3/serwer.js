var http = require ("http");
var url = require ("url");
var fs = require ("fs");
var qs = require("querystring");
var plik = 'index.html';

function Company(name, value) {
    this.name = name;
    this.value = value;
    this.get = function() {
        return "{name: this.name, value: this.value}";
    }
}

var c = [new Company("KGHM", 40), new Company("Intel", 80), new Company("Nvidia", 100)];
  
http.createServer (function (req, response) {
    console.log("--------------------------------------");
    console.log("Względny adres URL bieżącego żądania: " + req.url + "\n");
    var url_parts = url.parse (req.url, true);  //parsowanie (względnego) adresu URL
    if (url_parts.pathname == '/company' && req.method == 'GET') {  //Przetwarzanie zawartości formularza, jeżeli względny URL to '/submit' 
        console.log('submit');
        var num = Math.floor((Math.random() * 4) + 0);
        var company = c[num];
        if(company) company.value = Math.floor((Math.random() * (100 - 20 + 1)) + 20);
        response.writeHead(200, {"Content-Type": "application/json"}); 
        //response.write(company); //Dane (odpowiedź), które chcemy wysłać przeglądarce WWW
        response.end(JSON.stringify(company)); //Wysłanie odpowiedzi
        //console.log("Serw: " + JSON.stringify(company));
    }
    else { //Wysłanie, do przeglądarki, zawartości pliku (dokumentu HTML) o nazwie zawartej w zmiennej 'plik'
        fs.stat(plik, function (err,stats) {
          if (err == null) { //Jeżeli plik istnieje
              fs.readFile (plik, function (err, data) { //Odczytaj jego zawartość
                response.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
                response.write(data);   //Wyślij, przeglądarce, zawartość pliku 
                response.end();
              });
          }
          else { //Jeżeli plik nie  istnieje
              response.writeHead(200, {"Content-Type": "text/plain; charset=utf-8"});
              response.write('Plik ' + plik + ' nie istnieje');
              response.end();
          } //else
        }); //fs.stat
    } //else
}).listen(8080);
console.log("Uruchomiono serwer na porcie 8080");
console.log("Aby zakończyć działanie serwera, naciśnij 'CTRL+C'");
