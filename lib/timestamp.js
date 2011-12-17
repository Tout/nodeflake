var timestamps = require('./timestamp.js')

function timeGen(lastTimeStamp, ) {
    return (new Date).getTime();
}

function tillNextMillis(lastTimeStamp) {
    var timestamp = timestamps.timeGen();
    while(timestamp <= lastTimeStamp) {
        sleep(1);
        timestamp = timestamps.timeGen();
    }
    return timestamp;
}

exports.timeGen = timeGen;
exports.tillNextMillis = tillNextMillis;