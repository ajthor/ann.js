var _ = require("lodash");
var system = require("../system/system.js");

var rprop = module.exports = system.extend({

	sign: function(num) {
		if(Math.abs(num) < 1e-10) return 0;
		else if(num > 0) return 1;
		else return -1;
	},

	_iteration: function(input, ideal) {
		try {
			var i, j, k, change;
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
						// Calculate the gradient with respect to each weight,
						// compensating for bias at k = 0. The bias is always 1,
						// so the gradient would just be gradient * 1, anyway.
						if(k !== 0) {
							output = (this.network._layers[i-1] ? this.network._layers[i-1]._neurons[k-1].output : input[k-1]);
							neuron.gradients[k] *= output;
						}
						// Calculate the sign change.
						change = this.sign(neuron.gradients[k] * neuron.previousGradients[k]);

						neuron.deltas[k] = 0;

						if(change > 0) {
							// Sign has changed. Last delta was too big.
							neuron.updates[k] = Math.min(neuron.previousUpdates[k] * positiveStep, 50);
							neuron.deltas[k] = -1 * this.sign(neuron.gradients[k]) * neuron.updates[k];
							neuron.weights[k] += neuron.deltas[k];
							neuron.previousGradients[k] = neuron.gradients[k];
						}
						else if(change < 0) {
							// No change to the delta.
							neuron.updates[k] = Math.max(neuron.previousUpdates[k] * negativeStep, 1e-6);
							if(neuron.error > neuron.previousError) neuron.deltas[k] = -1 * neuron.previousDeltas[k];
							// neuron.weights[k] -= neuron.previousDeltas[k];
							neuron.previousGradients[k] = 0;
						}
						else {
							// Change is zero.
							neuron.deltas[k] = -1 * this.sign(neuron.gradients[k]) * neuron.updates[k];
							neuron.weights[k] += neuron.deltas[k];
							neuron.previousGradients[k] = neuron.gradients[k];
						}

						neuron.previousDeltas[k] = neuron.deltas[k];
						neuron.previousUpdates[k] = neuron.updates[k];

						if((i===0) && (j===0) && (k===1)) console.log(neuron.weights);

					}
					
				}
			}


		} catch(e) {
			console.log("Error:", e.stack);
		}
	}


});


