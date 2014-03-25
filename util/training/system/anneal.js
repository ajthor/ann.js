var _ = require("lodash");
var system = require("../system.js");

var rprop = module.exports = system.extend({

	train: function(inputs, outputs) {
		console.log("Starting simulated annealing training.");
		this.network.matrix.clone();
	},

	anneal: function(error) {
		var i, j, least;
		var n = this.network.matrix.neurons;

		// Initialize least to be the first neuron in the network.
		least = n[0][0];
		// Cycle through all neurons, and find the least fit.
		for(i = 0; i < n.length; i++) {
			for(j = 0; j < n[i].length; j++) {

				// console.log(i, j, n[i][j].error);

				if(Math.abs(n[i][j].error) > Math.abs(least.error)) {
					console.log("Found new least at: [%d, %d]", i, j, n[i][j].weights);
					least = n[i][j];
				}

			}
		}

		console.log("Previous weights:", least.weights);

		for(i = 0; i < least.weights.length; i++) {
			least.weights[i] *= Math.random();
		}

		console.log("New weights:", least.weights);

	},

	randomize: function() {
		var i, j, n = this.network.matrix.neurons;

	}

});