//String padding
if (!String.prototype.leftPad || String.prototype.leftPad.length < 2) {
    String.prototype.leftPad = function(finalLength, chr) {
        var padArray = [];
        if (!finalLength || isNaN(finalLength) || finalLength < 1) {
            finalLength = this.length;
        }
        if (!chr) {
            chr = "";
        }
        for (var i = 0; i < finalLength - this.length; i++) {
            padArray.push(chr);
        }
        return padArray.join("") + this;
    };
}
