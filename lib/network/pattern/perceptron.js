var _ = require("lodash");

var pattern = require("./pattern.js");

var bias = require("../bias.js");
var neuron = require("../neuron.js");

var feedForward = module.exports = pattern.extend({

	initialize: function(configuration, options) {
		var i, j;
		// Set up matrix.
		for(i = 0; i < configuration.length; i++) {
			this.neurons[i] = [];
			this.weights[i] = [];
			// For this layer, create new neurons.
			for(j = 0; j < configuration[i]; j++) {
				this.neurons[i][j] = new neuron();
				// For each neuron created, create 
				// an empty array of weights.
				this.weights[i][j] = [];
			}
			// If 'hasBias' option is set, create a bias neuron.
			if((this.options.hasBias) && (i < configuration.length-1)) {
				this.neurons[i].push(new bias());
				// Create weights for bias, even though they won't be used.
				this.weights[i].push(new Array());
			}
		}
	},

	run: function(input) {
		var i, j, result = [];
		// Copy the input array to avoid changes to the original.
		// Set it to be the 'input' layer.
		result[-1] = input.slice();

		// For every 'layer', assign an output value to the result array.
		for(i = 0; i < this.neurons.length; i++) {
			result[i] = [];
			for(j = 0; j < this.neurons[i].length; j++) {
				// Pass in the output of the previous layer 
				// and the weights of the current neuron.
				result[i][j] = this.neurons[i][j].run(result[i-1], this.weights[i][j]);
			}
		}

		// Copy result array to local property.
		this.result = result;

		return result[i-1];
	}

});


