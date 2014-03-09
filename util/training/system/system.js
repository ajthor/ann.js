var _ = require("lodash");
var extend = require("backbone-node").extend;

var system = module.exports = function(network, options) {
	this.network = network;
	this.options = _.defaults((options || {}), {
		iterations: 10000,
		maxError: 0.001
	});
	this.initialize.apply(this, arguments);
};

system.extend = extend;

_.extend(system.prototype, {

	initialize: function() {

	},

	train: function(inputs, ideals) {
		var index, error = 1.0;
		// Cycle through inputs and ideal values to train network
		// and avoid problem of "catastrophic forgetting"

		// Train until error < maxError OR iterations = maximum
		for(var i = 0; ((error > this.options.maxError) && (i < this.options.iterations)); i++) {
			// Get index mod length.
			index = i % inputs.length;
			// Run the network to populate output values.
			this.network.input(inputs[index]);
			// Run a training iteration.
			this._iteration(inputs[index], ideals[index]);
			// And calculate the error.
			error = this.calculateError(ideals[index]);
		} // End of an epoch.

		// End training.
		console.log("Training finished in %d iterations.", i);
		console.log("Error is at: %d", error);
	},

	calculateError: function(ideal) {
		var error = 0.0;
		var index = this.network._layers.length-1;
		var lastLayer = this.network._layers[index];
		// For every neuron in the last layer, ...
		for(var i = 0; i < lastLayer._neurons.length; i++) {
			// Calculate total error.
			error += Math.pow((ideal[i] - lastLayer._neurons[i].output), 2);
		}
		return error;
	},

	calculateGradients: function(ideal) {
		var i, j, k, neuron, output, error;
		// Starting from the last layer and working backward, calculate gradients.
		for(i = this.network._layers.length-1; i >= 0; i--) {
			// If there isn't a next layer, then this is the last layer.
			// In which case, use the ideal values rather than the error
			// of the previous layer.
			if(!this.network._layers[i+1]) {
				// Cycle through output neurons and calculate their gradients.
				for(j = 0; j < this.network._layers[i]._neurons.length; j++) {
					neuron = this.network._layers[i]._neurons[j];
					output = neuron.output;
					// Delta for output neurons is simply the derivative of the
					// activation function multiplied by the difference between
					// the ideal values and the actual output values.
					neuron.gradient = output * (1 - output) * (ideal[j] - output);
				}
			}
			// Else, the layer is not the last layer, and its error will
			// require more work to calculate.
			else {
				// Cycle through each neuron in the hidden layers, ...
				for(j = 0; j < this.network._layers[i]._neurons.length; j++) {
					neuron = this.network._layers[i]._neurons[j];
					output = neuron.output;
					// The index of this neuron is j.
					// Therefore, the corresponding weights in each neuron
					// will be at index j + 1.
					error = 0.0;
					// So for every neuron in the following layer, get the 
					// weight corresponding to this neuron.
					for(k = 0; k < this.network._layers[i+1]._neurons.length; k++) {
						// And multiply it by that neuron's gradient
						// and add it to the error calculation.
						error += this.network._layers[i+1]._neurons[k].weights[j+1] * this.network._layers[i+1]._neurons[k].gradient;
					}
					// Once you have the error calculation, multiply it by
					// the derivative of the activation function to get
					// the gradient of this neuron.
					neuron.gradient = output * (1 - output) * error;
				}
			}
		}
	}
	
});