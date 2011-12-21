var idworker = require("../lib/idworker2.js"),
    biginteger = require('bigdecimal').BigInteger,
    lastTimestamp = 0,
    lastSequence = biginteger('0'),
    hash = {};
    
var startTimer = (new Date).getTime();

for (var i = 0; i < 2000; ++i) {
    idworker.getId(lastTimestamp, lastSequence, function (timestamp, sequence) {
           lastTimestamp = timestamp;
           lastSequence = sequence;
       },
       function(err, result) {
           if (hash[result.toString()]) {
               console.log('**********************AUGH************************');
           } else {
               hash[result.toString()] = true;
           }
       });
}

var endTimer = (new Date).getTime();

console.log(endTimer - startTimer, "milliseconds");