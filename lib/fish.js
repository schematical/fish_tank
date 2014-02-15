var _ = require('underscore');
var async = require('async');
var Node = require('./node');
//var seed = require('seed-random');
module.exports = fish = function(options){
    this.score = 0;
    this.dna_strand_ct = 1;
    this.input_nodes = [];
    this.nodes = [];
    this.output_nodes = [];
    this.seed = Math.random();
    _.extend(this, options);
    this.spawn(this.parent);
    return this;
}
fish.prototype.spawn = function(parent){
    if(parent){
        throw new Error("Write me");
    }else{

    }
    var dna_strand_ct = this.dna_strand_ct;
    for(var i = 0; i < dna_strand_ct; i++){
        var keys = Object.keys(this.fish_tank.inputs);
        var input = this.fish_tank.inputs[keys[Math.round(Math.random() * keys.length)]];
        var input2 = this.fish_tank.inputs[keys[Math.round(Math.random() * keys.length)]];
        var node = new Node({
            input:input,
            input2:input2,
            fish:this
        });
        this.input_nodes.push(node);

        for(var ii = 0; ii < this.fish_tank.max_node_connections; ii++){
            //create middle connections
        }
        var output = this.fish_tank.outputs[keys[Math.round(Math.random() * keys.length)]];
        node.connect(output)

        this.nodes.push(node);
    }

}
fish.prototype.move = function(input, callback){
    async.eachSeries(
        this.input_nodes,
        function(input_node, next){
            if(_.isFunction(input_node.input)){
                var field = input_node.input;
                if(input[field.id]){
                    input_node.read(input[field.id], next);
                }
            }
        },
        function(){
            callback();
        }
    );
}
