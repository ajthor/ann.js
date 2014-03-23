var _ = require("lodash");
var system = require("../system.js");

var rprop = module.exports = system.extend({

	sign: function(num) {
		if(Math.abs(num) < 1e-10) return 0;
		// if(num === 0) return 0;
		if(num > 0) return 1;
		return -1;
	},

	train: function(inputs, ideals) {
		var i, j, index, sum, error = 1.0;
		// Start training.
		console.log("RPROP training started.");

		// Train until error < threshold OR iterations = maximum
		for(i = 0; ((error > this.options.threshold) && (i < this.options.iterations)); i++) {
			// Run through all inputs and ideals.
			sum = 0;

			for(j = 0; j < inputs.length; j++) {
				
				// Run the network to populate output values.
				this.network.input(inputs[j]);
				// Calculate gradients.
				this.calculateGradients(inputs[j], ideals[j]);

				// Run a training iteration.
				this._iteration();
				console.log(this.network._layers[0]._neurons[0].deltas);

				sum += this.calculateError(ideals[j]);
			}
			// Now update the weights.
			this.updateWeights();
			console.log(this.network._layers[0]._neurons[0].weights);

			// And calculate the batch error.
			error = sum / inputs.length;
			console.log("Error is at: %d", error);
			console.log("End of an epoch.\n");
		} // End of an epoch.

		// End training.
		console.log("Training finished in %d iterations.", i);
		console.log("Error is at: %d", error);
	},

	_iteration: function() {
		try {
			var index, i, j, k, change, delta, weightChange;
			var neuron, output;

			var positiveStep = 1.2;
			var negativeStep = 0.5;
				
			// Now that gradients are calculated, work forward to update weights.
			// For each layer, and each neuron in each layer, ...
			for(i = 0; i < this.network._layers.length; i++) {
				for(j = 0; j < this.network._layers[i]._neurons.length; j++) {
					neuron = this.network._layers[i]._neurons[j];

					// For all weights in neuron, ...
					for(k = 0; k < neuron.weights.length; k++) {

						// Calculate the sign change.
						change = this.sign(neuron.gradients[k] * neuron.previousGradients[k]);
						// neuron.deltas[k] = 0;


						// IRPROP+
						if(change > 0) {

							neuron.updates[k] = Math.min((neuron.previousUpdates[k] * positiveStep), 50);
							neuron.deltas[k] += this.sign(neuron.gradients[k]) * neuron.updates[k];
							neuron.previousGradients[k] = neuron.gradients[k];

						}
						else if(change < 0) {

							neuron.updates[k] = Math.max((neuron.previousUpdates[k] * negativeStep), 0.00001);
							if(neuron.error > neuron.previousError) neuron.deltas[k] += -1 * neuron.previousDeltas[k];
							neuron.previousGradients[k] = 0;

						}
						else {

							neuron.deltas[k] += this.sign(neuron.gradients[k]) * neuron.updates[k];
							neuron.previousGradients[k] = neuron.gradients[k];

						}


						// IRPROP-
						// if(change > 0) {
						// 	neuron.updates[k] = Math.min((neuron.previousUpdates[k] * positiveStep), 50);
						// }
						// else if(change < 0) {
						// 	neuron.updates[k] = Math.min((neuron.previousUpdates[k] * negativeStep), 1e-6);
						// 	neuron.gradients[k] = 0;
						// }

						// neuron.deltas[k] += (this.sign(neuron.gradients[k]) * neuron.updates[k]);



					}

					neuron.previousDeltas = neuron.deltas.slice();
					neuron.previousUpdates = neuron.updates.slice();
					
				}
			}

		} catch(e) {
			console.log("Error:", e.stack);
		}
	},

	updateWeights: function() {
		var i, j;
		// After calculating the deltas for each training sample,
		// update the weights.
		for(i = 0; i < this.network._layers.length; i++) {
			for(j = 0; j < this.network._layers[i]._neurons.length; j++) {
				neuron = this.network._layers[i]._neurons[j];

				for(k = 0; k < neuron.weights.length; k++) {
					neuron.weights[k] += neuron.deltas[k];
					// Reset delta values.
					neuron.deltas[k] = 0;
				}
			}
		}
	}


});


