var _ = require("lodash");

// Layer Class
// -----------
var layer = exports.layer = function layer() {
	this._neurons = [];
};

_.extend(layer.prototype, {
	parse: function(input) {
		var result = [];
		// For all neurons, ...
		for(var i = 0, len = this._neurons.length; i < len; i++) {
			// Push a result value to an output array.
			result[i] = this._neurons[i].parse(input);
		}
		return result;
	}

});

// Neuron Class
// ------------
var neuron = exports.neuron = function neuron() {
	// Weights array.
	this.weights = [1];
	// this.bias = Math.floor(Math.random() * (10 - (-10) + 1) + (-10));
	this.bias = 1;

	// Variables for backpropagation.
	this.input = [];
	this.output = 0;
	this.deltas = [0];
	this.previousDeltas = [0];
	this.updates = [0.1];
	this.previousUpdates = [0.1];
	this.gradient = [];
	this.previousGradient = [];
};

_.extend(neuron.prototype, {
	parse: function(input) {
		var sum = 0;
		// Cycle through each input and multiply it by a weight value.
		// bias + sigma(input * weight)
		for(var i = 0, len = input.length; i < len; i++) {
			// If no weight to handle current input, 
			// then create a new random weight.
			if(!this.weights[i+1]) {
				this.weights[i+1] = (function(min,max) {
				    return Math.floor(Math.random()*(max-min+1)+min);
				})(-1, 1);
				this.updates[i+1] = 0.1; // For rprop.
				this.previousUpdates[i+1] = 0.1; // For rprop.
				this.deltas[i+1] = 0.1; // For rprop.
				this.previousDeltas[i+1] = 0.1; // For rprop.
			}
			// Sum up the weights.
			sum += input[i] * this.weights[i+1];
		}
		// Add the bias.
		sum += this.weights[0];
		this.input = sum;
		// Sigmoid activation function.
		return this.output = (function(input) {
					return ( 1 / (1 + Math.exp(-1 * input)) );
				})(sum);
	}

});