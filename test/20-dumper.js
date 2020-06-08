'use strict';


var assert = require('assert');
var path   = require('path');
var fs     = require('fs');
var yaml   = require('../');

var TEST_SCHEMA = require('./support/schema').TEST_SCHEMA;


suite('Dumper', function () {
  var samplesDir = path.resolve(__dirname, 'samples-common');

  fs.readdirSync(samplesDir).forEach(function (jsFile) {
    if (path.extname(jsFile) !== '.js') return; // continue

    test(path.basename(jsFile, '.js'), function () {
      var sample       = require(path.resolve(samplesDir, jsFile));
      var data         = typeof sample === 'function' ? sample.expected : sample,
          serialized   = yaml.dump(data,       { schema: TEST_SCHEMA }),
          deserialized = yaml.load(serialized, { schema: TEST_SCHEMA });

      if (typeof sample === 'function') {
        sample.call(this, deserialized);
      } else {
        assert.deepEqual(deserialized, sample);
      }
    });
  });
});

suite('Dump flow reference', function(){
  var samplesDir = path.resolve(__dirname, 'dump-flow-reference');

  fs.readdirSync(samplesDir).forEach(function(jsFile){
    if(path.extname(jsFile) !== '.js') return;

    test(path.basename(jsFile,'.js'), function(){
      var sample = require(path.resolve(samplesDir, jsFile));
      var serialized = yaml.dump(sample, {flowLevel: 1});
      var deserialized = yaml.load(serialized);
      assert.deepEqual(deserialized, sample);
    })
  })
})
