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

						// IRPROP+
						if(change > 0) {

							n[i][j].updates[k] = Math.min((n[i][j].previousUpdates[k] * positiveStep), 50);
							n[i][j].deltas[k] = this.sign(n[i][j].gradients[k]) * n[i][j].updates[k];
							n[i][j].previousGradients[k] = n[i][j].gradients[k];

						}
						else if(change < 0) {

							n[i][j].updates[k] = Math.max((n[i][j].previousUpdates[k] * negativeStep), 0.00001);
							if(n[i][j].error > n[i][j].previousError) n[i][j].deltas[k] = -1 * n[i][j].previousDeltas[k];
							n[i][j].previousGradients[k] = 0;

						}
						else {

							n[i][j].deltas[k] = this.sign(n[i][j].gradients[k]) * n[i][j].updates[k];
							n[i][j].previousGradients[k] = n[i][j].gradients[k];

						}

						// // IRPROP-
						// if(change > 0) {
						// 	n[i][j].updates[k] = Math.min((n[i][j].previousUpdates[k] * positiveStep), 50);
						// }
						// else if(change < 0) {
						// 	n[i][j].updates[k] = Math.min((n[i][j].previousUpdates[k] * negativeStep), 1e-6);
						// 	n[i][j].gradients[k] = 0;
						// }

						// n[i][j].deltas[k] = (this.sign(n[i][j].gradients[k]) * n[i][j].updates[k]);
					}
					

				}
			}


		} catch(e) {
			console.log("Error:", e.stack);
		}
	}


});

