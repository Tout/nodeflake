//NodeFlake config
var config = {
    port : parseFloat(process.env.PORT) || 1337,
    dataCenterId : '1',
    workerId : '1',
    tcpSockets : 0,
    sockFile : '/tmp/nodeflake.sock'
};

module.exports = config;
