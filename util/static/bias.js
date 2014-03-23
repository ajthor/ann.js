var _ = require("lodash");
var neuron = require("./neuron.js");

var bias = module.exports = neuron.extend({
	initialize: function() {
		this.weights = [1];
		
		this.input = undefined;
		this.output = 1;
	},

	parse: function(input) {
		for(var i = 0; i < input.length; i++) {
			if(!this.weights[i]) this.weights[i] = 1;
		}
		return this.output;
	}
});