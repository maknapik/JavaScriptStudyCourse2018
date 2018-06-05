const modul = require('./modul');

x = Number(process.argv[2]);
y = Number(process.argv[3]);

var suma = modul.suma;
console.log(suma(x, y));
