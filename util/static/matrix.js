var _ = require("lodash");

var bias = require("./bias.js");
var neuron = require("./neuron.js");

var matrix = module.exports = function matrix(neurons, options) {
	this.options = _.defaults((options || {}), {
		hasBias: true
	});

	// Create empty matrix array.
	this.neurons = [];

	this.initialize(neurons, options);
};

_.extend(matrix.prototype, {
	initialize: function(neurons, options) {
		var i, j;
		// Set up matrix.
		for(i = 0; i < neurons.length; i++) {
			this.neurons[i] = [];
			// For this layer, create new neurons.
			for(j = 0; j < neurons[i]; j++) {
				this.neurons[i][j] = new neuron(options);
			}

			if((this.options.hasBias) && (i < neurons.length-1)) {
				this.neurons[i].push(new bias(options));
			}
		}

	},

	get: function(x, y) {
		if(!y) return this.neurons[x];
		return this.neurons[x][y];
	},

	parse: function(input) {
		var i, j, result = [];
		// Copy the input array to avoid changes to the original.
		// Set it to be the 'input' layer.
		result[-1] = input.slice();

		// For every 'layer', ...
		for(i = 0; i < this.neurons.length; i++) {
			// Assign a value to the result array.
			result[i] = [];
			for(j = 0; j < this.neurons[i].length; j++) {
				result[i][j] = this.neurons[i][j].parse(result[i-1]);
			}
		}

		// console.log("RESULT", result);

		return result[i-1];
	}
});