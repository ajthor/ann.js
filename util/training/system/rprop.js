var _ = require("lodash");
var system = require("../system.js");

var rprop = module.exports = system.extend({

	sign: function(num) {
		if(Math.abs(num) < 1e-10) return 0;
		// if(num === 0) return 0;
		if(num > 0) return 1;
		return -1;
	},

	calculateDeltas: function() {
		try {

			var i, j, k, n = this.network.matrix.neurons;
			var change;

			var positiveStep = 1.2;
			var negativeStep = 0.5;

			// Now that gradients are calculated, work forward to update weights.
			// For each layer, and each neuron in each layer, ...
			for(i = 0; i < n.length; i++) {
				for(j = 0; j < n[i].length; j++) {

					// For all weights in neuron, ...
					for(k = 0; k < n[i][j].weights.length; k++) {

						// Calculate the sign change.
						change = this.sign(n[i][j].gradients[k] * n[i][j].previousGradients[k]);

						// IRPROP-
						if(change > 0) {
							n[i][j].updates[k] = Math.min((n[i][j].updates[k] * positiveStep), 50);
						}
						else if(change < 0) {
							n[i][j].updates[k] = Math.min((n[i][j].updates[k] * negativeStep), 1e-6);
							n[i][j].gradients[k] = 0;
						}

						n[i][j].deltas[k] += (this.sign(n[i][j].gradients[k]) * n[i][j].updates[k]);

					}


				}
			}

			// var index, i, j, k, change, delta, weightChange;
			// var neuron, output;

			// var positiveStep = 1.2;
			// var negativeStep = 0.5;
				
			// // Now that gradients are calculated, work forward to update weights.
			// // For each layer, and each neuron in each layer, ...
			// for(i = 0; i < this.network._layers.length; i++) {
			// 	for(j = 0; j < this.network._layers[i]._neurons.length; j++) {
			// 		neuron = this.network._layers[i]._neurons[j];

			// 		// For all weights in neuron, ...
			// 		for(k = 0; k < neuron.weights.length; k++) {

			// 			// Calculate the sign change.
			// 			change = this.sign(neuron.gradients[k] * neuron.previousGradients[k]);
			// 			// neuron.deltas[k] = 0;


			// 			// IRPROP+
			// 			if(change > 0) {

			// 				neuron.updates[k] = Math.min((neuron.previousUpdates[k] * positiveStep), 50);
			// 				neuron.deltas[k] += this.sign(neuron.gradients[k]) * neuron.updates[k];
			// 				neuron.previousGradients[k] = neuron.gradients[k];

			// 			}
			// 			else if(change < 0) {

			// 				neuron.updates[k] = Math.max((neuron.previousUpdates[k] * negativeStep), 0.00001);
			// 				if(neuron.error > neuron.previousError) neuron.deltas[k] += -1 * neuron.previousDeltas[k];
			// 				neuron.previousGradients[k] = 0;

			// 			}
			// 			else {

			// 				neuron.deltas[k] += this.sign(neuron.gradients[k]) * neuron.updates[k];
			// 				neuron.previousGradients[k] = neuron.gradients[k];

			// 			}


			// 			// IRPROP-
			// 			// if(change > 0) {
			// 			// 	neuron.updates[k] = Math.min((neuron.previousUpdates[k] * positiveStep), 50);
			// 			// }
			// 			// else if(change < 0) {
			// 			// 	neuron.updates[k] = Math.min((neuron.previousUpdates[k] * negativeStep), 1e-6);
			// 			// 	neuron.gradients[k] = 0;
			// 			// }

			// 			// neuron.deltas[k] += (this.sign(neuron.gradients[k]) * neuron.updates[k]);



			// 		}

			// 		neuron.previousDeltas = neuron.deltas.slice();
			// 		neuron.previousUpdates = neuron.updates.slice();
					
			// 	}
			// }

		} catch(e) {
			console.log("Error:", e.stack);
		}
	}


});


