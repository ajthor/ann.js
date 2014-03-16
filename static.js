var _ = require("lodash");

// Layer Object
// -----------
var layer = exports.layer = function layer(count, options) {
	this.options = _.defaults((options || {}), {
		// By default, the layer has a bias.
		hasBias: true
	});
	// Create empty neurons array.
	this._neurons = [];
	this.initialize(count, options);
};

_.extend(layer.prototype, {
	initialize: function(count, options) {
		// Add in bias neuron.
		if(this.options.hasBias) this._neurons.push(new biasNeuron());
		// Populate with new neurons.
		for(var i = 0; i < count; i++) {
			this._neurons.add();
		}
	},

	add: function(args) {
		var n = args ? args : new neuron(this.options);
		this._neurons.push(n);
	},

	parse: function(input) {
		var result = [];
		// For all neurons, ...
		for(var i = 0, len = this._neurons.length; i < len; i++) {
			// Push a result value to an output array.
			result[i] = this._neurons[i].parse(input);
		}
		// Return result array.
		return result;
	}

});

// Bias Neuron Object
// ------------------
var biasNeuron = exports.biasNeuron = function biasNeuron() {
	this.output = 1;
	this.parse = function() {
		return this.output;
	};
};

// Neuron Object
// ------------
var neuron = exports.neuron = function neuron(options) {
	this.options = _.defaults((options || {}), {

	});
	// Weights array.
	this.weights = [];

	// Variables for training.
	this.input = 0;
	this.output = 0;

	this.error = 0;
	this.previousError = 0;

	this.delta = 0;

	this.deltas = [];
	this.previousDeltas = [];

	this.updates = [];
	this.previousUpdates = [];
	
	this.gradients = [];
	this.previousGradients = [];
	
	// Initialize
	this.initialize(options);
};

_.extend(neuron.prototype, {
	initialize: function(options) {},

	parse: function(input) {
		var sum = 0;
		// Cycle through each input and multiply it by a weight value.
		// bias + sigma(input * weight)
		for(var i = 0, len = input.length; i < len; i++) {
			// If no weight to handle current input, 
			// then create a new random weight.
			if(!this.weights[i]) {
				this.weights[i] = (function(min,max) {
				    return Math.random()*(max-min+1)+min;
				})(-1, 1);
				
				this.updates[i] = 0.1;
				this.previousUpdates[i] = 0.1;

				this.deltas[i] = 0;
				this.previousDeltas[i] = 0;

				this.gradients[i] = 0;
				this.previousGradients[i] = 0;
			}
			// Sum up the weights.
			sum += input[i] * this.weights[i];
		}
		this.input = sum;
		// Sigmoid activation function.
		return this.output = (function(input) {
					return ( 1 / (1 + Math.exp(-1 * input)) );
				})(sum);
	}

});