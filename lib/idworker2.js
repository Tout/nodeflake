var LOG = require("./utils/log.js"),
    BigInteger = require("bigdecimal").BigInteger,
    config = require("../config.js"),
    timestamps = require('./timestamp.js');

// Set Some variables
var workerId = new BigInteger(config.workerId),
    dataCenterId = new BigInteger(config.dataCenterId),
    sequenceBits = new BigInteger("12"),
    sequenceMask = new BigInteger('-1').xor(new BigInteger('-1').shiftLeft(sequenceBits)),
    workerIdBits = new BigInteger('5'),
    workerIdShift = sequenceBits,
    dataCenterIdBits = new BigInteger('5'),
    dataCenterIdShift = sequenceBits.add(workerIdBits),
    timeStampLeftShift = sequenceBits.add(workerIdBits).add(dataCenterIdBits),
    nepoch = new BigInteger('1311779587'); // gives us more time before this method fails

function getId(lastTimestamp, lastSequence, updateNumbers, callback) {
    'use strict';
    var timestamp = timestamps.timeGen(),
        sequence,
        result;

    if (timestamp === lastTimestamp) {
        sequence = lastSequence.add(new BigInteger('1')).and(sequenceMask);
        if (sequence === 0) {
            timestamp = timestamps.tillNextMillis(lastTimestamp);
        }
    } else {
        sequence = new BigInteger('0');
    }

    if (timestamp < lastTimestamp) {
        throw {"message": "Clock is going backwards, cannot make a new ID until clock catches up"};
    }

    updateNumbers(timestamp, sequence);
    // subtracting nepoch sets all timestamps in the past to give us a greater range before 
    // we run out. 
    result = new BigInteger(timestamp.toString()).subtract(nepoch).shiftLeft(timeStampLeftShift)
        .or(dataCenterId.shiftLeft(dataCenterIdShift)).or(workerId.shiftLeft(workerIdShift)).or(sequence);
    callback(null, result);
    LOG.info(result, Math.floor(Math.random() * 10E9));
    return result;
}

exports.getId = getId;

