var expect = chai.expect;
var sum = 0;

function suma2(x,y) 
{
    return x+y;
}
/******************************************/
function cyfry(napis)
{
    var sum = 0;
    for(x = 0; x < napis.length ; x++)
    {
        if(!isNaN(napis.charAt(x))) sum += parseInt(napis.charAt(x));
    }
    delete x;
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
    delete x;
    return sum;
}
/******************************************/
function suma(napis)
{
    if(isNaN(napis.charAt(0)) || napis.length == 0) return sum;
    else
    {
        sum += parseInt(napis);
    }
    return sum;
}
/******************************************/
function resetsum() { sum = 0;}
/******************************************/
describe('Funkcja cyfry(), litery() i suma()', function()
{
    it('Same cyfry', function()
    {
        expect(cyfry('2345')).to.equal(14);
        expect(litery('2345')).to.equal(0);
        expect(suma('2345')).to.equal(2345);
        expect(suma('5')).to.equal(2350);
    });
    it('Same litery', function()
    {
        expect(cyfry('abcde')).to.equal(0);
        expect(litery('abcde')).to.equal(5);
        resetsum();
        expect(suma('abcde')).to.equal(0);
        expect(suma('abcde')).to.equal(0);
    });
    it('Litery, a po nich cyfry', function()
    {
        expect(cyfry('abc345')).to.equal(12);
        expect(litery('abc345')).to.equal(3);
        expect(suma('abc345')).to.equal(0);
        expect(suma('abc345')).to.equal(0);
    });
    it('Cyfry, a po nich litery', function()
    {
        expect(cyfry('123abc')).to.equal(6);
        expect(litery('123abc')).to.equal(3);
        resetsum();
        expect(suma('10abc')).to.equal(10);
        expect(suma('15abc')).to.equal(25);
    });
    it('Pusty napis', function()
    {
        expect(cyfry('')).to.equal(0);
        expect(litery('')).to.equal(0);
        resetsum();
        expect(suma('')).to.equal(0);
        expect(suma('')).to.equal(0);
    });
});
/******************************************/
describe('Funkcja suma2()', function() 
{
    it('Zwraca 4 dla 2+2', function() 
    {
        expect(suma2(2,2)).to.equal(4);
    });
    it('Zwraca 0 dla -2+2', function() 
    {
        expect(suma2(-2,2)).to.equal(0);
    });
});