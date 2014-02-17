module.exports = function(){
    var key = _keys[Math.floor(Math.random() * _keys.length)];
    var ret = _logic[key];
    ret._type = key;
    return ret;
}
var debug = false;
var _logic = {
    is_me:function(data){
        if(debug) console.log('is_me: ' + data);
        return (this.id == data);
    },
    not_is_me:function(data){
        if(debug) console.log('not_is_me: ' + data);
        return (this.id != data);
    },
    not:function(data){
        if(debug) console.log('not: ' + data);

        return !(data);
    },
    exists:function(data){
        if(debug) console.log('exists: ' + data);
        if(data){
            return true;
        }
        return false;
    }
    //==  > < in etc
}
var _keys = Object.keys(_logic);