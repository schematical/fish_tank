var async = require('async');
var _ = require('underscore');
var Connection = require('./connection');
module.exports = node = function(options){
    this.outputs = [];
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
    if(!this.validate_input(input)){

        return false
    }
    this.inputs.push(input);
    return true;
}
node.prototype.validate_input = function(input){
    for(var i in this.inputs){
        if(this.inputs[i].validate_input){
            if(!this.inputs[i].validate_input(input)){
                return false;
            }
        }
    }
    return true;
}
/**
 * This should not take nodes
 * @param output
 */
node.prototype.add_output = function(output){
    this.outputs.push(output);
}
node.prototype.clear_value = function(input){
    this._value = null;
}
node.prototype.fire_outputs = function(callback){
    var _this = this;
    async.eachSeries(
        this.outputs,
        function(output, next){
            if(_this._value > .5){
                output.apply(_this.fish);
            }

            next();
        },
        callback
    );
}
node.prototype.fire = function(_callback){
    var _this = this;
    function callback(){
        _this.fire_outputs(_callback);
    }
    if(this._value){
        return callback(this._value);
    }

    var score = 0;
    async.eachSeries(this.inputs, function(input, next){
        function wrap_up(data){
            if(_this.logic){

                if(_this.logic.apply(_this.fish, [data])){
                    console.log("HIT!!!!!");
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
        //console.log("Score: "+ _this.id + ' - ' + _this._value + ' - ' + _this.inputs.length);
        _this._value = score;
        return callback(_this._value);
    });



}
node.prototype.serialize = function(){
    var ret = {
        id:this.id,
        inputs:[],
        logic: this.logic._type,
        outputs:[]
    }
    for(var i in this.inputs){
        if(this.inputs[i].id){
            ret.inputs.push(this.inputs[i].id)
        }else{
            console.error("Cannot serialize: ");
            console.error(this.inputs[i]);
        }
    }
    for(var i in this.outputs){
        if(this.outputs[i].id){
            ret.outputs.push(this.outputs[i].id)
        }else{
            console.error("Cannot serialize: ");
            console.error(this.outputs[i]);
        }
    }
    return ret;
}