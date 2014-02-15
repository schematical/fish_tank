var async = require('async');
var _ = require('underscore');
var Connection = require('./connection');
module.exports = node = function(options){
    this.output_to = [];
    this.inputs = [];
    this._value = null;
    _.extend(this, options);
    return this;
}
node.prototype.connect = function(to_node, value){
    this.output_to.push(new Connection({
        from_node:this,
        to_node:to_node,
        value:value
    }));
}
node.prototype.add_input = function(input){
    this.inputs.push(input);
}
node.prototype.clear_value = function(input){
    this._value = null;
}
node.prototype.fire = function(callback){
    var _this = this;
    if(this._value){
        return callback(this._value);
    }

    var score = 0;
    async.eachSeries(this.inputs, function(input, next){
        function wrap_up(data){
            if(_this.logic){
                if(_this.logic(data)){
                    score += 1/_this.inputs.length;
                }
            }else{
                console.error("No logic set");
            }
            return next();
        }

        if(_.isFunction(input)){
            var data = input();
            wrap_up(data)
        }else{
            if(input.fire){
                input.fire(wrap_up)
            }
        }
    }, function(){
        this._value = score;
        return callback(this._value);
    });



}