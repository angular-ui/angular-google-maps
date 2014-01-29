'use strict';


var fs   = require('fs');
var path = require('path');
var util = require('util');
var yaml = require('../lib/js-yaml');


try {
  var filename = path.join(__dirname, 'sample_document.yaml'),
      contents = fs.readFileSync(filename, 'utf8'),
      data     = yaml.load(contents);

  console.log(util.inspect(data, false, 10, true));
} catch (err) {
  console.log(err.stack || String(err));
}
