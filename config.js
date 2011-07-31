//NodeFlake config
var config = {
    port : parseFloat(process.env.PORT) || 1337,
    dataCenterId : 1,
    workerId : 1,
    useSockets : 0
};

module.exports = config;
