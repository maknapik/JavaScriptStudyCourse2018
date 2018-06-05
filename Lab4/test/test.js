var expect = require('chai').expect;
var modul = require('../modul');

describe('Funkcja suma()', function() {
it('Zwraca 4 dla 2+2', function() {
expect(modul.suma(2,2)).to.equal(4);
});

it('Zwraca 0 dla -2+2', function() {
expect(modul.suma(-2,2)).to.equal(0);

});
});