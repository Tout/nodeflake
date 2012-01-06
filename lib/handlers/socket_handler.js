var idlistener = require('../idlistener.js');

function handle(connection, currentTimeValues) {
    'use strict';
    idlistener.listen_for_id(currentTimeValues, function (data) {
        if (data.indexOf("err") > -1) {
            connection.write('err');
        } else {
            connection.write(data);
        }
    });
}
exports.handle = handle;