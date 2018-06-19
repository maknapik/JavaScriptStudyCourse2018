var http = require ("http");
var url = require ("url");
var fs = require ("fs");
var qs = require("querystring");
var plik = 'index.html';
  
http.createServer (function (req, response) {
    console.log("--------------------------------------");
    console.log("Względny adres URL bieżącego żądania: " + req.url + "\n");

    var url_parts = url.parse (req.url, true);  //parsowanie (względnego) adresu URL
    if (url_parts.pathname == '/directory' && req.method == 'POST') {  //Przetwarzanie zawartości formularza, jeżeli względny URL to '/submit' 
    console.log('submit');
      var body='';
            req.on('data', function (data) {
                body += data;
            });
            req.on('end',function(){
                var POST =  qs.parse(body);
                var path = POST['path'];
                console.log("path: " + path);
                if(path === undefined) path = "";

                var files
                try {
                    files = fs.readdirSync(path);
                } catch {
                    try {
                        path = path.substr(0, path.lastIndexOf('/'));
                        files = fs.readdirSync(path);
                    } catch {
                        response.writeHead(200, {"Content-Type": "text/plain; charset=utf-8"}); 
                    response.write(JSON.stringify("")); //Dane (odpowiedź), które chcemy wysłać przeglądarce WWW
                    response.end(); //Wysłanie odpowiedzi
                    return;
                    }
                }
                var tab = [];
                files.forEach(file => {
                    var stat = fs.lstatSync(path + "/" + file);
                    if(!stat.isDirectory()) {
                        tab.push({file: file, type: "F"});
                    } else {
                        tab.push({file: file, type: "D"});
                    }
                });

                response.writeHead(200, {"Content-Type": "text/plain; charset=utf-8"}); 
                response.write(JSON.stringify(tab)); //Dane (odpowiedź), które chcemy wysłać przeglądarce WWW
                response.end(); //Wysłanie odpowiedzi
            }); 
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
