var timestamps = require('./timestamp.js');

function timeGen(lastTimeStamp) {
    'use strict';
    return (new Date()).getTime();
}

function tillNextMillis(lastTimestamp) {
    'use strict';
    var timestamp = timestamps.timeGen();
    while (timestamp <= lastTimestamp) {
        timestamp = timestamps.timeGen();
    }
    return timestamp;
}

exports.timeGen = timeGen;
exports.tillNextMillis = tillNextMillis;