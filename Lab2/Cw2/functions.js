var sum = 0;

function show()
{
    var str = window.prompt("Wprowadź string", "");
    if(str == null) document.write("Suma: " + sum);
    var csum = cyfry(str);
    var lsum = litery(str);
    suma(str);
    window.alert("  " + csum + "  " + lsum + "  " + sum);
    show();
}
/******************************************/
function cyfry(napis)
{
    var sum = 0;
    for(x = 0; x < napis.length ; x++)
    {
        if(!isNaN(napis.charAt(x))) sum += parseInt(napis.charAt(x));
    }
    return sum;
}
/******************************************/
function litery(napis)
{
    var sum = 0;
    for(x = 0; x < napis.length ; x++)
    {
        if(isNaN(napis.charAt(x))) sum++;
    }
    return sum;
}
/******************************************/
function suma(napis)
{
    if(isNaN(napis.charAt(0))) return sum;
    else
    {
        sum += parseInt(napis);
    }
    return sum;
}