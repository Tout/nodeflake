var idworker = require("../lib/idworker.js");
var worker = idworker.getIdWorker(0, 0);

var startTimer = (new Date).getTime();

for (var i = 0; i < 2000; ++i) {
    var id = worker.getId("test agent");
}

var endTimer = (new Date).getTime();

console.log(endTimer - startTimer, "milliseconds");