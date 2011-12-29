var idlistener = require('../idlistener.js'),
    url = require('url'),
    querystring = require('querystring');

function handle(response, request, currentTimeValues) {
    var urlObj = url.parse(request.url, true);
    if (request.url.indexOf("favicon") > -1) {
        return_error(response);
    } else {
        idlistener.listen_for_id(currentTimeValues, function (data) {
            if (data.toString().indexOf("err") > -1) {
                return_error(response);
            } else {
                response.writeHead(200, {
                                    'Content-Type' : 'text/javascript',
                                    'Cache-Control': 'no-cache',
                                    'Connection'   : 'close'
                                    });
                response.end(wrappedResponse(urlObj, '{"id":' + data + '}'));
            }
        });
    }
}

function wrappedResponse(urlObj, responseString) {
    if (querystring.parse(urlObj.query)["callback"]) {
        return urlObj.query["callback"] + "(" + responseString + ");";
    } else {
        return responseString;
    }
}

function return_error(response) {
    response.writeHead(404, {'Content-Type':'text/plain'});
    response.end("Not Found");    
}
exports.handle = handle;