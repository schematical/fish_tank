var _ = require('underscore');
var async = require('async');
var Fish = require('./fish');
module.exports = fish_tank = function(options){
    this.max_fish = 10;
    this.max_ticks = 100;
    this.fish_coll = [];
    this.max_node_connections = 1;
    _.extend(this, options);
    return this;
}
fish_tank.prototype.run = function(callback){
    this.spawn();
    var ticks = 0;
    var running = true;
    var _this = this;
    async.doUntil(function(next){
        _this.tick(function(is_done){
            if(is_done){
                running = false;

            }
            ticks += 1;
            next();
        })
    }, function(){
        console.log("Running: " + ticks + ' < ' + _this.max_ticks);
        if(ticks > _this.max_ticks){
            return true;
        }
        return !running;
    }, function(){
        console.log("Ending...");
        callback();
    })
}
fish_tank.prototype.tick = function(next){
    var _this = this;
    this.on_tick(function(is_done){
        if(is_done){
            return next(true);
        }
        async.eachSeries(
            _this.fish_coll,
            function(fish, callback){
                fish.move(
                    _this.inputs,
                    callback
                )
            },
            function(){

                next();
            }
        );
    })
}
fish_tank.prototype.spawn = function(){
    for(var i = 0; i < this.max_fish; i++){
        this.fish_coll.push(new Fish({ id: i, fish_tank: this }));
    }

}