var _ = require('underscore');
var async = require('async');
var Node = require('./node');
var logic = require('./logic');
//var seed = require('seed-random');
module.exports = fish = function(options){
    this.score = 0;
    this.dna_strand_ct = 25;
    this.input_nodes = [];
    this.nodes = [];
    this.output_nodes = [];
    this.seed = Math.random();
	this.generation = 0;
    _.extend(this, options);
    this.spawn(this.parent);
    return this;
}
fish.prototype.spawnChild = function(){
	var child = new fish({
		id: this.id + '.' ,
		fish_tank: this.fish_tank,
		generation: this.generation + 1,
		parent: this
	});
	this.fish_coll.push(child);
	return child;
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
            logic:logic(),
            id: 'node-' + this.id + ':' + i
        });
        var out_key = keys[Math.floor(Math.random() * keys.length)];
        var output = this.fish_tank.outputs[out_key];
        node.add_output(output)
        this.output_nodes.push(node);


        this.nodes.push(node)
        var last_node = node;
        for(var ii = 0; ii < this.fish_tank.max_strands_len; ii++){
            var middle_node = new Node({
                fish:this,
                logic:logic(),
                id: 'node-' + this.id + ':' + i + '.' + ii
            });
           // console.log(middle_node.id);
            var connection_ct = 0;
            var trys = 0;
            while(
                connection_ct <   this.fish_tank.max_node_connections && trys < 10
            ){
                var input = this.nodes[Math.floor(Math.random() * this.nodes.length)];

                if(last_node.add_input(middle_node)){
                    connection_ct += 1;
                }
            };


            //create middle connections
            this.nodes.push(middle_node);
            last_node = middle_node;
        }


        while(
            connection_ct <   this.fish_tank.max_node_connections && trys < 10
        ){
            var keys = Object.keys(this.fish_tank.inputs);
            var i1_key = keys[Math.floor(Math.random() * keys.length)];
            var input = this.fish_tank.inputs[i1_key];
            input.id = i1_key;

            if(last_node.add_input(input)){
                connection_ct += 1;
            }
        };


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
fish.prototype.serialize = function(){
    var ret = {
        id:this.id,
        output_nodes:[],
        nodes:[]
    };

    var _this = this;
    async.each(
        this.output_nodes,
        function(output_node){

            ret.output_nodes.push(output_node.id);// = output_node.serialize();

        }
    );
    async.each(
        _this.nodes,
        function(node){

            ret.nodes[node.id] = node.serialize();

        }
    );
    return ret;
}
fish.prototype.kill = function(){
	this.fish_tank.killFish(this.id);
}
