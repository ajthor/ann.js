var _ = require("lodash");
var system = require("../system/system.js");

var rprop = module.exports = system.extend({

	train: function(inputs, ideals) {
		console.log("BEGIN RESILIENT PROPAGATION");
		var err = 1, index;
		// Cycle through inputs and ideal values to train network
		// and avoid problem of "catastrophic forgetting"
		for(var i = 0; i < 10; i++) {
			index = i % inputs.length;
			// console.log(err);
			err = this._iteration(inputs[index], ideals[index]);
		} // End of an epoch.
	},

	sign: function(num) {
		if(num > 0) return 1;
		if(num < 0) return -1;
		return 0;
	},

	_iteration: function(input, ideal) {
		try {
			var i, j, k, l, change, delta, sigErr;
			var neuron, output;

			var positiveStep = 1.2;
			var negativeStep = 0.5;

			// Run the network to populate output values.
			this.network.input(input);

			// Begin resilient propagation.

			sigErr = 0;
			this.network._layers[0]._neurons[0].bias = "balogna";

			// For every layer working backwards, ...
			for(i = this.network._layers.length-1; i >= 0; i--) {
				// If there isn't a following layer, then this
				// is the last layer.
				if(!this.network._layers[i+1]) {
					// Since this is the last layer, the error calculation
					// will use the actual output values instead of the
					// outputs of the following neuron.
					for(j = 0; j < this.network._layers[i]._neurons.length; j++) {
						neuron = this.network._layers[i]._neurons[j];
						output = neuron.output;
						// Delta values are calculated weight by weight.
						// Reset the gradient array.
						neuron.gradient = [];
						// Calculate the gradient for each weight.
						for(k = 0; k < neuron.weights.length; k++) {
							// Gradient = d/dx * E * weight
							neuron.gradient[k] = output * (1 - output) * (ideal[j] - output) * neuron.weights[k];
						}
						// Calculate total error.
						sigErr += Math.pow((ideal[j] - output), 2);
					}
				}
				// Otherwise, this layer is not the last layer.
				else {
					// This means that slightly more complicated math will be involved.
					// For every layer that is not the last layer,
					// we will use the output of the following layer
					// to calculate the delta values.
					// So, for every neuron in this layer, ...
					for(j = 0; j < this.network._layers[i]._neurons.length; j++) {
						neuron = this.network._layers[i]._neurons[j];
						output = neuron.output;
						// The index of this neuron is j.
						// Therefore, the corresponding weights in each neuron
						// will also be at index j.
						neuron.gradient = [];
						// The error calculation will be the sum of the error
						// from all corresponding neurons in following layer.
						error = 0.0;
						// Calculate the error.
						for(k = 0; k < this.network._layers[i+1]._neurons.length; k++) {
							// Error is weight multiplied by corresponding gradient.
							error += this.network._layers[i+1]._neurons[k].weights[j] * this.network._layers[i+1]._neurons[k].gradient[j];
						}
						// Multiply the error 
						for(k = 0; k < neuron.weights.length; k++) {
							neuron.gradient[k] = output * (1 - output) * error * neuron.weights[k];
						}

					}
				}
			}
			// Now that gradients are calculated, work forward to update weights.
			// For each layer, ...
			for(i = 0; i < this.network._layers.length; i++) {
				// For each neuron in each layer, ...
				for(j = 0; j < this.network._layers[i]._neurons.length; j++) {
					neuron = this.network._layers[i]._neurons[j];

					// For each weight in this neuron, ...
					for(k = 0; k < neuron.weights.length; k++) {
						if(!neuron.previousGradient[k]) neuron.previousGradient[k] = 0;
						change = this.sign(neuron.gradient[k] * neuron.previousGradient[k]);

						if(change > 0) {
							// Sign has changed. Last delta was too big.
							neuron.updates[k] = Math.min(neuron.previousUpdates[k] * positiveStep, 50);
							neuron.deltas[k] = -1 * this.sign(neuron.gradient[k]) * neuron.updates[k];
							neuron.weights[k] += neuron.deltas[k];
							neuron.previousGradient[k] = neuron.gradient[k];
						}
						else if(change < 0) {
							// No change to the delta.
							neuron.updates[k] = Math.max(neuron.previousUpdates[k] * negativeStep, 1e-5);
							neuron.deltas[k] = -1 * neuron.previousDeltas[k];
							neuron.weights[k] -= neuron.previousDeltas[k];
							neuron.previousGradient[k] = 0;
						}
						else {
							// Change is zero.
							neuron.deltas[k] = -1 * this.sign(neuron.gradient[k]) * neuron.updates[k];
							neuron.weights[k] += neuron.deltas[k];
							neuron.previousGradient[k] = neuron.gradient[k];
						}

						neuron.previousDeltas[k] = neuron.deltas[k];
						neuron.previousUpdates[k] = neuron.updates[k];

						if((i==0) && (j==0) && (k==0)) console.log(neuron);
					}
				}
			}

			return sigErr;

		} catch(e) {
			console.log("Error:", e.stack);
		}
	}


});


