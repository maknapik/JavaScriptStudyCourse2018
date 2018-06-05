var http = require ("http");
var url = require ("url");
var fs = require ("fs");
var qs = require("querystring");
var plik = 'formularz.html';
  
http.createServer (function (req, response) {
    console.log("--------------------------------------");
    console.log("Względny adres URL bieżącego żądania: " + req.url + "\n");
    var url_parts = url.parse (req.url, true);  //parsowanie (względnego) adresu URL
    if (url_parts.pathname == '/date' && req.method == 'GET') {
        console.log("Date");
        response.writeHead(200, {"Content-Type": "text/plain; charset=utf-8"}); 
        var date = new Date();
        response.write(date.toGMTString()); //Dane (odpowiedź), które chcemy wysłać przeglądarce WWW
        response.end(); //Wysłanie odpowiedzi
    }
    else if (url_parts.pathname == '/submit' && req.method == 'POST') {  //Przetwarzanie zawartości formularza, jeżeli względny URL to '/submit' 
    console.log('submit');
      var body='';
            req.on('data', function (data) {
                body +=data;
            });
            req.on('end',function(){
                var POST =  qs.parse(body);
                var powitanie = 'Witaj ' + POST['imie'];
                response.writeHead(200, {"Content-Type": "text/plain; charset=utf-8"}); 
                response.write(powitanie); //Dane (odpowiedź), które chcemy wysłać przeglądarce WWW
                response.end(); //Wysłanie odpowiedzi
                console.log("Serwer wysłał do przeglądarki tekst: '"+powitanie+"'");
            }); 
    }
    else if (url_parts.pathname == '/submit' && req.method == 'GET') {  //Przetwarzanie zawartości formularza, jeżeli względny URL to '/submit' 
        var powitanie = 'Witaj ' + url_parts.query['imie']
        response.writeHead(200, {"Content-Type": "text/plain; charset=utf-8"}); 
        response.write(powitanie); //Dane (odpowiedź), które chcemy wysłać przeglądarce WWW
        response.end(); //Wysłanie odpowiedzi
        console.log("Serwer wysłał do przeglądarki tekst: '"+powitanie+"'");
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

          //2.1:
        /*response.writeHead(200, {"Content-Type": "text/plain; charset=utf-8"}); 
        var date = new Date();
        response.write(date.toGMTString()); //Dane (odpowiedź), które chcemy wysłać przeglądarce WWW
        response.end(); //Wysłanie odpowiedzi*/
        }); //fs.stat
    } //else
}).listen(8080);
console.log("Uruchomiono serwer na porcie 8080");
console.log("Aby zakończyć działanie serwera, naciśnij 'CTRL+C'");
