var _ = require("lodash");
var extend = require("backbone-node").extend;

var system = module.exports = function(network, options) {
	this.network = network;
	this.options = _.defaults((options || {}), {
		iterations: 20000,
		threshold: 0.0001
	});
	this.initialize.apply(this, arguments);
};

system.extend = extend;

_.extend(system.prototype, {

	initialize: function() {},

	train: function(inputs, ideals) {
		var i, j, sum, error = 1.0;

		// Start training.
		console.log("Training started.");

		// Cycle through inputs and ideal values to train network
		// and avoid the problem of catastrophic forgetting.

		// Train until error < threshold OR iterations = maximum
		for(i = 0; ((error > this.options.threshold) && (i < this.options.iterations)); i++) {
			// Run through all inputs and ideal values.
			sum = 0;

			// Reset neurons.
			this.resetNeurons();

			for(j = 0; j < inputs.length; j++) {
				// Run the network to populate values.
				this.network.parse(inputs[j]);

				// Calculate gradients. (Batch mode)
				this.calculateGradients(inputs[j], ideals[j]);

				// Calculate error.
				sum += this.calculateError(ideals[j]);
			}

			// Run a training iteration.
			this.calculateDeltas();

			// And finally, update the weights.
			this.updateWeights();

			// And calculate the batch error.
			error = sum / inputs.length;

			if(!(i % 100)) console.log("Error: [ %d ] %d", error, i);
		}
		// End training.
		console.log("Training finished in %d iterations.", i);
		console.log("Error is at: %d", error);

	},

	resetNeurons: function() {
		var i, j, k, n = this.network.matrix.neurons;
		// For every neuron in every 'level', ...
		for(i = 0; i < n.length; i++) {
			for(j = 0; j < n[i].length; j++) {

				// Assign previousError value.
				n[i][j].previousError = n[i][j].error;
				n[i][j].error = 0;

				// Assign previousGradients values.
				n[i][j].previousGradients = n[i][j].gradients.slice();
				// Assign previousDeltas values.
				n[i][j].previousDeltas = n[i][j].deltas.slice();
				// Assign previousUpdates values.
				n[i][j].previousUpdates = n[i][j].updates.slice();

				// Reset gradient values.
				n[i][j].gradients = Array.apply(null, new Array(n[i][j].weights.length)).map(Number.prototype.valueOf,0);
				// Reset delta values.
				n[i][j].deltas = Array.apply(null, new Array(n[i][j].weights.length)).map(Number.prototype.valueOf,0);
				// Reset update values.
				// n[i][j].updates = Array.apply(null, new Array(n[i][j].weights.length)).map(Number.prototype.valueOf,0.1);

			}
		}
	},

	updateWeights: function() {
		var i, j, k, n = this.network.matrix.neurons;
		// For every neuron in every 'level', ...
		for(i = 0; i < n.length; i++) {
			for(j = 0; j < n[i].length; j++) {
				// For each weight, ...
				for(k = 0; k < n[i][j].weights.length; k++) {

					// Add each delta value to the weight.
					n[i][j].weights[k] += n[i][j].deltas[k];
					
				}

			}
		}
	},

	calculateError: function(ideal) {
		var n = this.network.matrix.neurons;
		var error = 0.0;
		var lastLayer = n[n.length-1];
		// For every neuron in the last layer, ...
		for(var i = 0; i < lastLayer.length; i++) {
			// Calculate total error.
			error += Math.pow((ideal[i] - lastLayer[i].output), 2);
		}
		return error;
	},

	calculateGradients: function(inputs, ideals) {
		var i, j, k, len, n = this.network.matrix.neurons;

		var error;
		// For every 'level', working backwards...
		for(i = n.length-1; i >= 0; i--) {
			// For every neuron, ...
			for(j = 0; j < n[i].length; j++) {
				// Reset the error.
				error = 0.0;
				// If this is the last layer, the error is the difference between
				// the ideal and the actual values.
				if(!n[i+1]) {
					error = ideals[j] - n[i][j].output;
				}
				// Otherwise, the error is the sum of the weights multiplied by
				// the corresponding neuron's delta value.
				else {
					// The index of this neuron is j,
					// therefore, the corresponding weights will also be at j.

					// So for each neuron in the following layer, ...
					for(k = 0; k < n[i+1].length; k++) {
						error += n[i+1][k].weights[j] * n[i+1][k].delta;
					}
				}

				// Assign error to neuron.
				n[i][j].previousError = n[i][j].error;
				n[i][j].error = error;
				// Assign delta.
				n[i][j].delta = n[i][j].output * (1 - n[i][j].output) * error;

			}

		}

		// Working forwards, after all partial derivatives have been calculated, ...
		for(i = 0; i < n.length; i++) {
			for(j = 0; j < n[i].length; j++) {
				// Set up gradient values for the future.
				// Gradients are the derivatives w/r to the weights.
				for(k = 0; k < n[i][j].gradients.length; k++) {
					n[i][j].gradients[k] += n[i][j].delta * ((i > 0) ? n[i-1][k].output : inputs[k]);
				}

			}

		}

	}
	
});