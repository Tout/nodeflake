require ("./string.js");

(function(exports) {

function toBitString(num) {
    return num.toString(2);
}

function padBitString(bitString, size) {
    return bitString.leftPad(size, "0");
}

function bitCompare(first, second, comparator) {
    var result = [];
    first = toBitString(first);
    second = toBitString(second);
    var charCount = (first.length < second.length) ? second.length : first.length;
    first = padBitString(first, charCount);
    second = padBitString(second, charCount);

    for (var i = charCount; i > 0; --i) {
        var f = first.charAt(i), s = second.charAt(i);
        result.unshift(comparator(f, s) ? 1 : 0);
    }

    return parseInt(result.join(""), 2);
}

exports.lshift = function (num, bits) {
    return num * Math.pow(2,bits);
};

exports.rshift = function (num, bits) {
    return num / Math.pow(2,bits);
};

exports.bAnd = function(first, second) {
    return bitCompare(first, second, function(f, s) { return (f === "1" && s === "1")});
};

exports.bOr = function(first, second) {
    return bitCompare(first, second, function(f, s) { return (f === "1" || s === "1")});
};

exports.bXor = function(first, second) {
    return bitCompare(first, second, function(f, s) { return (f === "1" && s === "0") || (f === "0" && s === "1")});
};
})(exports);