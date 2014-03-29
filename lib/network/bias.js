var _ = require("lodash");
var neuron = require("./neuron.js");

var bias = module.exports = neuron.extend({
	initialize: function() {		
		this.input = undefined;
		this.output = 1;

		this.state = 1;

		this.activation = function bias() {return (1/(1+Math.exp(-1)));};
		this.derivative = function ddxbias() {return 0;};
	},

	run: function(input, weights) {
		for(var i = 0; i < input.length; i++) {
			if(!weights[i]) {
				weights[i] = 1;
			}
		}
		return this.output;
	}
	
});