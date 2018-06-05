const fs = require('fs');

var path = process.argv[2];
var file = fs.statSync(path);
var buffer;

if(file.isFile()) {
    console.log('It is a file');
    buffer = fs.readFileSync(path);
    console.log(buffer.toString('ascii'));

}
else console.log('It is not a file');