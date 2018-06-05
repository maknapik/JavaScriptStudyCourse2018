var http = require("http");
var url = require("url");

const fs = require('fs');
// var path = process.argv[2];

var buffer = "test";

function doIt(path)
{
    var fileStat = fs.statSync(path, (err, stats) => {});
    if(fileStat.isFile()){
        fs.readFile(path, 'utf8', function(err, data) {  
            if (err) throw err;
            buffer = data;
        });
        return buffer;
    }
    else return "It is not a file";
}

 
http.createServer(function(request, response) {
    /*
      ,,request''  - strumień wejściowy - zawiera dane otrzymane od przeglądarki, np. zakodowaną zawartość pól formularza HTML
       
      ,,response'' - strumień wyjściowy - umieszcza się w nim dane, które chcemy odesłać przeglądarce.
        Odpowiedź, wysyłana za pomocą tego strumienia, musi się składać z dwóch części: nagłówka oraz ciała.
        W nagłówku umieszcza się, m.in., informację o typie (MIME) danych  zawartych w ciele.
        W ciele umieszcza się właściwe dane, np. definicję formularza.
    */
    console.log("--------------------------------------")
    console.log("Względny adres URL bieżącego żądania: "+request.url+"\n")
    var url_parts = url.parse(request.url,true); //parsowanie (względnego) adresu URL
     
    if(url_parts.pathname == '/submit') { //Przetwarzanie zawartości formularza, jeżeli względny URL to '/submit' 
        var filepath=url_parts.query['pathname']; //Odczytaj zawartość pola (formularza) o nazwie 'pathname'
        // console.log("Tworzenie nagłówka odpowiedzi")
        response.writeHead(200, {"Content-Type": "text/plain; charset=utf-8"});  //Tworzenie nagłówka odpowiedzi - informujemy przeglądarkę, że w ciele odpowiedzi będzie zwykły tekst (text/plain)
        // console.log("Tworzenie ciała odpowiedzi")
        // response.write('Witaj '+imie); //Umieść podane dane (tu: tekst 'Witaj ...') w ciele odpowiedzi
        response.write(doIt(filepath));
        response.end(); //Koniec odpowiedzi - wyślij ją do przeglądarki
        // console.log("Wysyłanie odpowiedzi")
    }
    else { //Generowanie formularza
        console.log("Tworzenie nagłówka odpowiedzi")
        response.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});  //Tworzenie nagłówka odpowiedzi - informujemy przeglądarkę, że w ciele odpowiedzi będzie tekst w formacie HTML
        //a teraz  w ciele odpowiedzi umieszczamy formularz HTML
        console.log("Tworzenie ciała odpowiedzi")
        response.write('<form method="GET" action="/submit">');
        response.write('<label for="pathname">Podaj ścieżkę do pliku</label>');
        response.write('<input name="pathname">');
        response.write('<br>');
        response.write('<input type="submit">');
        response.write('<input type="reset">');
        response.write('</form>');
        response.end();  //Koniec odpowiedzi - wyślij ją do przeglądarki
        console.log("Wysyłanie odpowiedzi")
    } 
}).listen(8080);
console.log("Uruchomiono serwer na porcie 8080");
console.log("Aby zakończyć działanie serwera, naciśnij 'CTRL+C'");
