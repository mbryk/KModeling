/* Helper function to format strings using placeholders like this {0}, {1} where number is the number of argument
 * for the function or the offset of an array if it's given as an only argument and it also handles double brackets
 * like this {{0}} if you want it to output as {0} and not as a placeholder */
String.prototype.format = function(){
    var args = arguments;
    if(args.length == 1 && (typeof args[0] == 'Array')){
        args = args[0];
    }
    return this.replace(/\{\{|\}\}|\{(\d+)\}/g, function (m, n) {
        if (m == "{{") { return "{"; }
        if (m == "}}") { return "}"; }
        return args[n];
    });
};



/**
 * Helper function to insert nodes values instead of placeholders.
 * @param ids
 * @param nodeCollection
 */
String.prototype.formatNodesValue = function(nodeCollection){
    return this.replace(/\{\{|\}\}|\{(\d+)\}/g, function (m, n) {
        if (m == "{{") { return "{"; }
        if (m == "}}") { return "}"; }
        return nodeCollection.get(n).getValue();
    });
};


/**
 * Helper function to check syntax inserting numbers instead of nodes
 * @param ids
 * @param nodeCollection
 */
String.prototype.prepareForSyntax = function(){
    return this.replace(/\{\{|\}\}|\{(\d+)\}/g, function (m, n) {
        if (m == "{{") { return "{"; }
        if (m == "}}") { return "}"; }
        return n;
    });
};
/**
 * Helper function to insert nodes units instead of placeholders. The order in the array of node ids should be correlated to what's
 * in the formula
 * @param ids
 * @param nodeCollection
 */
String.prototype.formatNodesUnits = function(nodeCollection, unitsObj){
    return this.replace(/\{\{|\}\}|\{(\d+)\}/g, function (m, n) {
        if (m == "{{") { return "{"; }
        if (m == "}}") { return "}"; }
        return nodeCollection.get(parseInt(n)).get('units').replaceUnitsWithNumbers(unitsObj);
    });
};

String.prototype.replaceUnitsWithNumbers = function(unitsObj){
    return this.replace(/(\w+)/g, function (m, n) {
        if(!unitsObj[n]) throw "Those units undefined"
        return unitsObj[n];
    });
}