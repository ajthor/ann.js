var _ = require("lodash");
var system = require("../system.js");

var backpropagation = module.exports = system.extend({

	initialize: function() {
		if(!this.options.learningRate) this.options.learningRate = 0.5;
		if(!this.options.momentum) this.options.momentum = 0.9;
	},

	calculateDeltas: function() {
		try {
			var i, j, k, n = this.network.matrix.neurons;
			// Begin backpropagation.

			for(i = 0; i < n.length; i++) {
				for(j = 0; j < n[i].length; j++) {
					// For each weight, ...
					for(k = 0; k < n[i][j].weights.length; k++) {
						// Modify the weight by multiplying the weight by the
						// learning rate and the derivative w/r to this weight.
						n[i][j].deltas[k] = this.options.learningRate * n[i][j].gradients[k];
						// Apply momentum values.
						n[i][j].deltas[k] += this.options.momentum * n[i][j].previousDeltas[k];

						// to use on-line training, uncomment these two lines:
						// n[i][j].weights[k] += n[i][j].deltas[k];
					}

					// Set previous delta values.
					// n[i][j].previousDeltas = n[i][j].deltas.slice();

				}
			}

		} catch(e) {
			console.log("Error:", e.stack);
		}
	}


});

