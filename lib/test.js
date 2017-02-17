const parser = require('./parser.js')

var par = new parser();

var file = '/home/drew/.atom/scaffolding/test_structure.txt';

par.readFile(file);
