var LOG = require("./utils/log.js");
var bitwise = require("./utils/longBitwise.js");

//IdWorker
function IdWorker(workerId, dataCenterId) {
    this.workerId = workerId;
    this.dataCenterId = dataCenterId,

    this.lastTimeStamp = -1;

    this.sequence = 0;
    this.sequenceBits = 12;
    this.sequenceMask = bitwise.bXor(-1, bitwise.lshift(-1, this.sequenceBits));

    this.workerIdBits = 5;
    this.workerIdShift = this.sequenceBits;

    this.dataCenterIdBits = 5;
    this.dataCenterIdShift = this.sequenceBits + this.workerIdBits;

    this.timeStampLeftShift = this.sequenceBits + this.workerIdBits + this.dataCenterIdBits;

    this.nepoch = 1311779587209;

    //TODO check config settings and throw error if incorrect.

    LOG.info("ID worker starting. timestamp left shift", this.timeStampLeftShift, ", datacenter id bits", this.dataCenterIdBits,
             ", worker id bits", this.workerIdBits, ", sequence bits", this.sequenceBits, ", workerid", this.workerId);
}

IdWorker.prototype.getId = function (useragent) {
    if (!useragent) {
       //TODO throw error
       LOG.error("Invalid User Agent");
    }

    var id = this.nextId();

    LOG.info(id, useragent, Math.floor(Math.random() * 10E9));

    return id;
};

IdWorker.prototype.nextId = function() {
    var timestamp = this.timeGen();

    if (timestamp == this.lastTimeStamp) {
        this.sequence = bitwise.bAnd((this.sequence + 1), this.sequenceMask)
        if (this.sequence == 0) {
            timestamp = this.tillNextMillis(this.lastTimeStamp);
        }
    } else {
        this.sequence = 0;
    }

    if (timestamp < this.lastTimeStamp) {
        //TODO throw error
        return;
    }

    this.lastTimeStamp = timestamp;

    return bitwise.bOr(bitwise.bOr(bitwise.bOr(bitwise.lshift((timestamp - this.nepoch),this.timeStampLeftShift),
      bitwise.lshift(this.dataCenterId,this.dataCenterIdShift)),
      bitwise.lshift(this.workerId,this.workerIdShift)),
      this.sequence);

};

IdWorker.prototype.timeGen = function() {
    return (new Date).getTime();
};

IdWorker.prototype.tillNextMillis = function(lastTimeStamp) {
    var timestamp = this.timeGen();
    while(timestamp <= lastTimeStamp) {
        timestamp = this.timeGen();
    }
    return timestamp;
};


exports.getIdWorker = function(workerId, dataCenterId) {
    return new IdWorker(workerId, dataCenterId);
};

