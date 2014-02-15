var _ = require('underscore');
module.exports = connection = function(options){
    _.extend(options, this);
    return this;
}
