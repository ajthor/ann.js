var _ = require("lodash");
var system = require("../system.js");

var backpropagation = module.exports = system.extend({

	initialize: function() {
		if(!this.options.learningRate) this.options.learningRate = 0.5;
		if(!this.options.momentum) this.options.momentum = 0.9;
	},

	calculateDeltas: function() {
		try {
			var i, j, k, weights = this.network.matrix.weights;
			// Begin backpropagation.

			for(i = 0; i < weights.length; i++) {
				for(j = 0; j < weights[i].length; j++) {
					// For each weight, ...
					for(k = 0; k < weights[i][j].length; k++) {
						// Modify the weight by multiplying the weight by the
						// learning rate and the derivative w/r to this weight.
						this.deltas[i][j][k] = this.options.learningRate * this.gradients[i][j][k];
						// Apply momentum values.
						this.deltas[i][j][k] += this.options.momentum * this.previousDeltas[i][j][k];

						// to use on-line training, uncomment these two lines:
						// weights[i][j][k] += this.deltas[i][j][k];
					}

					// Set previous delta values.
					// previousDeltas[i][j] = this.deltas[i][j].slice();

				}
			}

		} catch(e) {
			console.error("Error:", e.stack);
		}
	}


});

