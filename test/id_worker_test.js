var vows = require('vows'),
    suite = vows.describe('id_worker')
    idWorker = require('./../lib/idworker2.js'),
    assert = require('assert'),
    lastTimestamp = 0,
    lastSequence = require('bigdecimal').BigInteger('0');
    
suite.addBatch({
   'An idWorker': {
        topic: idWorker,
        'returns a number': function (topic) {
           topic.getId(lastTimestamp, lastSequence, function (timestamp, sequence) {
               lastTimestamp = timestamp;
               lastSequence = sequence;
           },
           function(err, result) {
               console.log("result is a " + typeof(result));
               assert.isObject(result);
           });
        },
        'returns a time-sorted number': function (topic) {
            var a = 0;
            var b = 0;
            topic.getId(lastTimestamp, lastSequence, function (timestamp, sequence) {
               lastTimestamp = timestamp;
               lastSequence = sequence;
            },
            function(err, result) {
               a = result;
            });
            topic.getId(lastTimestamp, lastSequence, function (timestamp, sequence) {
                  lastTimestamp = timestamp;
                  lastSequence = sequence;
              },
              function(err, result) {
                  b = result;
              });
            assert.equal(b.max(a).toString(), b.toString());
            assert.notEqual(b.compareTo(a), 0);
        }
    }
}).export(module);