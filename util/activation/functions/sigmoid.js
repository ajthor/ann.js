var _ = require("lodash");

var sigmoid = module.exports = function sigmoid() {};

_.extend(sigmoid.prototype, {
	activation: function(input) {
		return ( 1 / (1 + Math.exp(-1 * input)) );
	},

	derivative: function(output) {
		return ( output * ( 1 - output ) );
	}

});