var _ = require("lodash");
var system = require("../system/system.js");

var rprop = module.exports = system.extend({

	sign: function(num) {
		if(num > 0) return 1;
		if(num < 0) return -1;
		return 0;
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
						if(!neuron.previousGradients[k]) neuron.previousGradients[k] = 0;

						change = this.sign(neuron.gradients[k], neuron.previousGradients[k]);

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
							neuron.updates[k] = Math.max(neuron.previousUpdates[k] * negativeStep, 1e-5);
							if(neuron.error > neuron.previousError) neuron.deltas[k] = -1 * neuron.previousDeltas[k];
							neuron.weights[k] -= neuron.previousDeltas[k];
							neuron.previousGradients[k] = 0;
						}
						else {
							// Change is zero.
							neuron.deltas[k] = -1 * this.sign(neuron.gradients[k]) * neuron.updates[k];
							neuron.weights[k] += neuron.deltas[k];
							neuron.previousGradients[k] = neuron.gradients[k];
						}

						// neuron.weights[k] += neuron.deltas[k];

						neuron.previousDeltas[k] = neuron.deltas[k];
						neuron.previousUpdates[k] = neuron.updates[k];

						if((i===0) && (j===0) && (k===0)) console.log(neuron);

					}
					
				}
			}


			// // For each layer, ...
			// for(i = 0; i < this.network._layers.length; i++) {
			// 	// For each neuron in each layer, ...
			// 	for(j = 0; j < this.network._layers[i]._neurons.length; j++) {
			// 		neuron = this.network._layers[i]._neurons[j];

			// 		// For each weight in this neuron, ...
			// 		for(k = 0; k < neuron.weights.length; k++) {
			// 			if(!neuron.previousGradient[k]) neuron.previousGradient[k] = 0;
			// 			change = this.sign(neuron.gradient[k] * neuron.previousGradient[k]);

			// 			if(change > 0) {
			// 				// Sign has changed. Last delta was too big.
			// 				neuron.updates[k] = Math.min(neuron.previousUpdates[k] * positiveStep, 50);
			// 				neuron.deltas[k] = -1 * this.sign(neuron.gradient[k]) * neuron.updates[k];
			// 				neuron.weights[k] += neuron.deltas[k];
			// 				neuron.previousGradient[k] = neuron.gradient[k];
			// 			}
			// 			else if(change < 0) {
			// 				// No change to the delta.
			// 				neuron.updates[k] = Math.max(neuron.previousUpdates[k] * negativeStep, 1e-5);
			// 				neuron.deltas[k] = -1 * neuron.previousDeltas[k];
			// 				neuron.weights[k] -= neuron.previousDeltas[k];
			// 				neuron.previousGradient[k] = 0;
			// 			}
			// 			else {
			// 				// Change is zero.
			// 				neuron.deltas[k] = -1 * this.sign(neuron.gradient[k]) * neuron.updates[k];
			// 				neuron.weights[k] += neuron.deltas[k];
			// 				neuron.previousGradient[k] = neuron.gradient[k];
			// 			}

			// 			neuron.previousDeltas[k] = neuron.deltas[k];
			// 			neuron.previousUpdates[k] = neuron.updates[k];

			// 			if((i===0) && (j===0) && (k===0)) console.log(neuron);
			// 		}
			// 	}
			// }

		} catch(e) {
			console.log("Error:", e.stack);
		}
	}


});


