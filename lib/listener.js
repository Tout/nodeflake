var config = require('../config.js');

var worker = require('./idworker.js').getIdWorker(config.workerId, config.dataCenterId);


function listen(c) {
  var nextId = worker.getId('stub', c, function(c, id) {
    c.write(id);
  });
}

exports.listen = 'listen';