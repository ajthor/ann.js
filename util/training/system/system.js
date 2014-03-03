var _ = require("lodash");
var extend = require("backbone-node").extend;

var system = module.exports = function(network) {
	this.network = network;
	this.initialize.apply(this, arguments);
};

system.extend = extend;

_.extend(system.prototype, {

	initialize: function() {

	},

	train: function() {}
	
});