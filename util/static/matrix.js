var _ = require("lodash");

var bias = require("./bias.js");
var neuron = require("./neuron.js");

var matrix = module.exports = function matrix(configuration, options) {
	this.options = _.defaults((options || {}), {
		configuration: configuration,
		hasBias: true
	});

	// Create empty matrix array.
	this.neurons = [];
	// Create empty array of weights.
	this.weights = [];

	this.initialize(this.options.configuration, options);
};

_.extend(matrix.prototype, {
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
			// If 'hasBias' options is set, create a bias neuron.
			if((this.options.hasBias) && (i < configuration.length-1)) {
				this.neurons[i].push(new bias());
				// Create weights for bias, even though they won't be used.
				this.weights[i].push(new Array());
			}
		}
	},

	calculateError: function(ideal) {
		var error = 0.0;
		var last = this.neurons[this.neurons.length-1];
		// For every neuron in the last layer, ...
		for(var i = 0; i < last.length; i++) {
			// Calculate total error.
			error += Math.pow(( ideal[i] - last[i].output ), 2);
		}
		return error;
	},

	forEach: function(cb, handler) {
		try {
			if(!cb) throw new Error("Must supply a callback to the 'forEach' function.");
			handler || (handler = this);
			var i, j;
			for(i = 0; i < this.neurons.length; i++) {
				for(j = 0; j < this.neurons[i].length; j++) {
					cb.call(handler, this.neurons[i][j], i, j);
				}
			}
		} catch(e) {
			console.log("Error:", e.stack);
		}
	},

	clone: function() {
		// Create new matrix object.
		var clone = new this.constructor(this.options.configuration, this.options);
		// Copy weights from this object to the clone.
		this.forEach(function(n, i, j) {
			clone.weights[i][j] = this.weights[i][j].slice();
		});

		return clone;
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