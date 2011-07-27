var LOG = require("./utils/log.js");

//IdWorker
function IdWorker(workerId, dataCenterId, redis) {
    this.workerId = workerId;
    this.dataCenterId = dataCenterId,
    this.redis = redis;

    this.lastTimeStamp = -1;

    this.sequence = 0;
    this.sequenceBits = 6;
    this.sequenceMask = -1 ^ (-1 << this.sequenceBits);

    this.workerIdBits = 3;
    this.workerIdShift = this.sequenceBits;

    this.dataCenterIdBits = 3;
    this.dataCenterIdShift = this.sequenceBits + this.workerIdBits;

    this.timeStampLeftShift = this.sequenceBits + this.workerIdBits + this.dataCenterIdBits;

    this.nepoch = 1311779587209;

    LOG.info("ID worker starting. timestamp left shift", this.timeStampLeftShift, "datacenter id bits", this.dataCenterIdBits,
             "worker id bits", this.workerIdBits, "sequence bits", this.sequenceBits, "workerid", this.workerId);
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
        this.sequence = (this.sequence + 1) & this.sequenceMask
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

    return ((timestamp - this.nepoch) << this.timeStampLeftShift) |
      (this.dataCenterId << this.dataCenterIdShift) |
      (this.workerId << this.workerIdShift) |
      this.sequence

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


exports.getIdWorker = function(workerId, dataCenterId, redisObj) {
    return new IdWorker(workerId, dataCenterId, redisObj);
};

