var _ = require("lodash");
var extend = require("backbone-node").extend;

var neuron = module.exports = function neuron(options) {
	this.options = _.defaults((options || {}), {

	});

	// Sigmoid function.
	this.activation = function sigmoid(x) {
						return ( 1 / (1 + Math.exp(-1 * x)) );
					};
	this.derivative = function ddxsigmoid(x) {
						return ( this.output * (1 - this.output) ) + 0.1;
					};

	// // Hyperbolic tangent function.
	// this.activation = function tanh(x) {
	// 					return (Math.exp(x) - Math.exp(-x)) / (Math.exp(x) + Math.exp(-x));
	// 				};
	// this.derivative = function dtanh(x) { // tanh
	// 					return ( 1 - (this.output * this.output) ); 
	// 				};
	
	// Array of weights.
	this.weights = [];

	// Variables to aid in training.
	this.delta;

	this.deltas = [];
	this.updates = [];
	this.gradients = [];

	// Initialize neuron.
	this.initialize(options);
};

neuron.extend = extend;

_.extend(neuron.prototype, {
	initialize: function(options) {},
	
	run: function(input) {
		var sum = 0;
		// Cycle through each input and multiply it by a weight value.
		for(var i = 0, len = input.length; i < len; i++) {
			// If there is no weight available to handle the current
			// input, create a new weight and training values for it.
			if(!this.weights[i]) {
				// Set the weight equal to a random value between -1 and 1.
				this.weights[i] = (function(min, max) {
					return Math.random() * (max - min + 1) + min;
				})(-1, 1);
				// this.weights[i] = Math.random();

				this.deltas[i] = 0;
				this.updates[i] = 0.1;
			}

			// Sum up the weights.
			sum += input[i] * this.weights[i];
		}

		this.input = sum;
		
		return this.output = this.activation(sum);
	}

});
