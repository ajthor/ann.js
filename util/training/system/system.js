var _ = require("lodash");
var extend = require("backbone-node").extend;

var system = module.exports = function(network, options) {
	if(!(this instanceof system)) return new system(network, options);
	
	this.network = network;
	this.options = _.defaults((options || {}), {
		iterations: 20000,
		threshold: 0.0001
	});

	this.initialize.apply(this, arguments);
};

system.extend = extend;

_.extend(system.prototype, {

	initialize: function() {},

	train: function() {},

	resetArray: function(array, value) {
		value || (value = 0);
		var result = Array.apply(null, new Array(array.length)).map(Number.prototype.valueOf, value);
		for(var i = 0; i < array.length; i++) {
			if(Array.isArray(array[i]))
				result[i] = this.resetArray(array[i], value);
		}
		return result;
	},

	cloneArray: function(array) {
		var result = array.slice();
		for(var i = 0; i < array.length; i++) {
			if(Array.isArray(array[i])) 
				result[i] = this.cloneArray(array[i]);
		}
		return result;
	}
	
});