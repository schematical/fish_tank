var _ = require('underscore');
var async = require('async');
var Node = require('./node');
var logic = require('./logic');
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

        var node = new Node({
            fish:this,
            logic:logic()
        });

        var input = this.fish_tank.inputs[keys[Math.floor(Math.random() * keys.length)]];
        var input2 = this.fish_tank.inputs[keys[Math.floor(Math.random() * keys.length)]];
        node.add_input(input);
        node.add_input(input2);

        for(var ii = 0; ii < this.fish_tank.max_node_connections; ii++){
            //create middle connections
            //this.nodes.push(node);
        }
        var output = this.fish_tank.outputs[keys[Math.floor(Math.random() * keys.length)]];
        node.connect(output)
        this.output_nodes.push(node);

    }

}
fish.prototype.move = function(input, callback){
    async.eachSeries(
        this.output_nodes,
        function(output_node, next){

            return output_node.fire(next);

        },
        function(){
            //clear value caching
            for(var i in this.nodes){
                this.nodes[i].clear_value();
            }
            callback();
        }
    );
}
