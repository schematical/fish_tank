var _ = require('underscore');
var Connection = require('./connection');
module.exports = node = function(options){
    this.output_to = [];
    _.extend(options, this);
    return this;
}
node.prototype.connect = function(to_node, value){
    this.output_to.push(new Connection({
        from_node:this,
        to_node:to_node,
        value:value
    }));
}