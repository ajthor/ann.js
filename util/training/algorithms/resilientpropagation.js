var _ = require("lodash");
var system = require("../system/system.js");

var rprop = module.exports = system.extend({

	train: function(inputs, ideals) {
		var err = 1, index;
		// Cycle through inputs and ideal values to train network
		// and avoid problem of "catastrophic forgetting"
		for(var i = 0; err > 0.0001; i++) {
			index = i % inputs.length;
			err = this._iteration(inputs[index], ideals[index]);
		} // End of an epoch.
	},

	_iteration: function(input, ideal) {
		try {
			var i, j, k, previous, error, sigErr;
			var neuron, output;

			// Run the network to populate output values.
			this.network.input(input);

			// Begin backpropagation.

			sigErr = 0.0;

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
						// Calculate total error.
						sigErr += Math.pow((ideal[j] - output), 2);
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
						// will also be at index j.
						error = 0.0;
						// So for every neuron in the following layer, get the 
						// weight corresponding to this neuron.
						for(k = 0; k < this.network._layers[i+1]._neurons.length; k++) {
							// And multiply it by that neuron's gradient
							// and add it to the error calculation.
							error += this.network._layers[i+1]._neurons[k].weights[j] * this.network._layers[i+1]._neurons[k].gradient;
						}
						// Once you have the error calculation, multiply it by
						// the derivative of the activation function to get
						// the gradient of this neuron.
						neuron.gradient = output * (1 - output) * error;
					}
				}
			}
			// Once all gradients are calculated, work forward and calculate
			// the new weights. w = w + (lr * df/de * in)
			for(i = 0; i < this.network._layers.length; i++) {
				// For each neuron in each layer, ...
				for(j = 0; j < this.network._layers[i]._neurons.length; j++) {
					neuron = this.network._layers[i]._neurons[j];
					// Modify the bias.
					neuron.bias += this.network.options.learningRate * neuron.gradient;
					// For each weight, ...
					for(k = 0; k < neuron.weights.length; k++) {
						// Modify the weight by multiplying the weight by the
						// learning rate and the input of the neuron preceding.
						// If no preceding layer, then use the input layer.
						neuron.deltas[k] = this.network.options.learningRate * neuron.gradient * (this.network._layers[i-1] ? this.network._layers[i-1]._neurons[k].output : input[k]);
						neuron.weights[k] += neuron.deltas[k];
						neuron.weights[k] += this.network.options.momentum * neuron.previousDeltas[k];
					}
					// Set previous delta values.
					neuron.previousDeltas = neuron.deltas.slice();
				}
			}

			return sigErr;

		} catch(e) {
			console.log("Error:", e.stack);
		}
	}


});


