var _ = require("lodash");

var bias = require("./bias.js");
var neuron = require("./neuron.js");

var matrix = module.exports = function matrix(neurons, options) {
	this.options = _.defaults((options || {}), {
		hasBias: true
	});

	// Create empty matrix array.
	this.neurons = this.n = [];

	this.initialize(neurons, options);
};

_.extend(matrix.prototype, {
	initialize: function(neurons, options) {
		var i, j;
		// Set up matrix.
		for(i = 0; i < neurons.length; i++) {
			this.n[i] = [];
			// For this layer, create new neurons.
			for(j = 0; j < neurons[i]; j++) {
				this.n[i][j] = new neuron();
			}
			// If 'hasBias' options is set, create a bias neuron.
			if((this.options.hasBias) && (i < neurons.length-1)) {
				this.n[i].push(new bias());
			}
		}
	},

	get: function(x, y) {
		if(!y) return this.n[x];
		return this.n[x][y];
	},

	parse: function(input) {
		var i, j, result = [];
		// Copy the input array to avoid changes to the original.
		// Set it to be the 'input' layer.
		result[-1] = input.slice();

		// For every 'layer', ...
		for(i = 0; i < this.n.length; i++) {
			// Assign a value to the result array.
			result[i] = [];
			for(j = 0; j < this.n[i].length; j++) {
				result[i][j] = this.n[i][j].parse(result[i-1]);
			}
		}

		// console.log("RESULT", result);

		return result[i-1];
	}
});