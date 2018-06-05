const fs = require('fs');
var http = require("http");
var url = require("url");

var products = []

var file = fs.readFileSync("shop.txt").toString('ascii');
var lines = file.split('\n');

for(var x  = 0; x < lines.length ; x++)
{
    var attributes = lines[x].split(" ");
    products.push(new Product(attributes[0], attributes[1], attributes[2], attributes[3]));
}

function Product(name, price, category, amount)
{
    this.name = name;
    this.price = parseInt(price);
    this.category = category;
    this.amount = amount;

    this.show = function()
    {
        console.log(this.name + " | " + this.price + " | " + this.category + " | " + this.amount);
    }

    this.json = function()
    {
        var str = '{"name":"' + this.name + '","price":' + this.price + 
                  ',"category":"' + this.category + '","amount":' + this.amount + '}';
        return str;
    }
}

function makeJSON()
{
    var content = '[';
    for(var x = 0 ; x < products.length ; x++)
    {
        content += products[x].json() + ',';
    }
    content += ']';
    content = content.replace(',]', ']');
    console.log(JSON.parse(content));
}

function buy(name, amount)
{
    for(var x = 0 ; x < products.length ; x++)
    {
        if(products[x].name == name)
        {
            if(products[x].amount < amount)
            {
                makeJSON();
                return "Brak wystarczajacej ilosci produktu w sklepie\n";
            }
            products[x].amount -= amount;
            console.log("new amount: " + products[x].amount);
            var content = "Produkt znajduje sie w sklepie\n\n";
            content += "Paragon:\n";
            content += "Nazwa | Ilosc | Cena jedn. | Cena\n"
            content += name + " | " + amount + " | ";
            content += products[x].price + " | " + products[x].price * amount + "\n";
            makeJSON();
            return content;
        }
    }
    makeJSON();
    return "Nie ma takiego produktu w sklepie\n";
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
    //console.log("Względny adres URL bieżącego żądania: "+request.url+"\n")
    var url_parts = url.parse(request.url,true); //parsowanie (względnego) adresu URL
     
    if(url_parts.pathname == '/submit') { //Przetwarzanie zawartości formularza, jeżeli względny URL to '/submit' 
        var name=url_parts.query['name'];
        var amount = url_parts.query['amount']
        // console.log("Tworzenie nagłówka odpowiedzi")
        response.writeHead(200, {"Content-Type": "text/plain; charset=utf-8"});  //Tworzenie nagłówka odpowiedzi - informujemy przeglądarkę, że w ciele odpowiedzi będzie zwykły tekst (text/plain)
        // console.log("Tworzenie ciała odpowiedzi")
        // response.write('Witaj '+imie); //Umieść podane dane (tu: tekst 'Witaj ...') w ciele odpowiedzi
        response.write(buy(name, amount));
        response.end(); //Koniec odpowiedzi - wyślij ją do przeglądarki
        // console.log("Wysyłanie odpowiedzi")
    }
    else { //Generowanie formularza
        response.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});  //Tworzenie nagłówka odpowiedzi - informujemy przeglądarkę, że w ciele odpowiedzi będzie tekst w formacie HTML
        //a teraz  w ciele odpowiedzi umieszczamy formularz HTML
        console.log("Tworzenie ciała odpowiedzi")
        response.write('<form method="GET" action="/submit">');
        response.write('<label for="name">Podaj nazwe produktu</label>');
        response.write('<input name="name">');
        response.write('<label for="amount">Podaj ilosc</label>');
        response.write('<input name="amount">');
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