var idworker = require("../lib/idworker.js");
var worker = idworker.getIdWorker(0, 0);
var hash = {};

var startTimer = (new Date()).getTime();

for (var i = 0; i < 2000; ++i) {
    var id = worker.getId("test agent");
    if (hash[id]) {
        console.log('**********************AUGH************************');
    } else {
        hash[id] = true;
    }
}

var endTimer = (new Date()).getTime();

console.log(endTimer - startTimer, "milliseconds");