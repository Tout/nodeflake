var LOG = function () {
    'use strict';
    this.WARN = "WARN";
    this.ERROR = "ERROR";
    this.INFO = "INFO";
};

LOG.prototype.logMessage = function (type, messageObj) {
    'use strict';
    var messageTxt = "";
    for (var x in messageObj) {
        if (messageObj[x]) {
            messageTxt += messageObj[x] + " ";
        }
    }
    console.log(type + ": " + messageTxt);
};

LOG.prototype.error = function () {
    'use strict';
    this.logMessage(this.ERROR, arguments);
};

LOG.prototype.info = function () {
    'use strict';
    this.logMessage(this.INFO, arguments);
};

LOG.prototype.warn = function () {
    'use strict';
    this.logMessage(this.WARN, arguments);
};

module.exports = new LOG();