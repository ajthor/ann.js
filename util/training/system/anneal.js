var _ = require("lodash");
var system = require("../system.js");

var rprop = module.exports = system.extend({

	train: function(inputs, ideals) {
		var i, j, sum, Ebest = 1, E, error = 1.0;

		var clone, matrix = this.network.matrix.clone();
		best = matrix.clone();

		// Set initial temperature.
		var T = 10;
		
		// Probability function.
		var P;

		// Start training.
		console.log("Simulated annealing training starting.");

		// Cycle through inputs in order to train for
		// all ideal values.

		// Train until error is less than threshold OR T reaches 0;
		for(var i = 0; ((error > this.options.threshold) && (T > 0)); i++) {

			// E is the old error;
			E = error;

			// Reset error.
			sum = 0;

			// Anneal the weights by cycling through the weights
			// and applying the annealing algorithm to them.

			// Clone the best matrix.
			clone = best.clone();
			// NOTE: Not sure if this is technically the correct annealing 
			// algorithm. I decided to set the starting matrix to the best matrix.
			// I did this because by setting it to the current matrix,
			// the algorithm failed to converge about 99% of the time.
			// After the change, the algorithm converges 100% of the time with
			// current temperature values.

			// First, randomize the weights.
			clone = this.randomize(clone, T);

			// For each input, anneal the network.
			for(j = 0; j < inputs.length; j++) {

				// Run the matrix to calculate outputs.
				clone.run(inputs[j]);
				// Add to the new error.
				sum += clone.calculateError(ideals[j]);

			}

			// And calculate the total new error.
			error = sum / inputs.length;

			// If the new error is less than the
			// old error, then the new solution is better.
			if(error < E) {
				// So accept the new solution.
				matrix = clone;

				if(error < Ebest) {
					// New best result.
					Ebest = error;
					best = clone;
				}
			}
			// If it's not necessarily better, 
			// check if it's possible to jump to this 
			// less-than-ideal solution.
			else {
				// Calculate probability.
				P = Math.exp((E - error) / T);
				// Can we move?
				if(P > Math.random()) {
					// Accept the new solution.
					matrix = clone;
				}

			}



			// Reduce T by some value.
			T -= 0.00001;

			// if(!(i%1000)) console.log("Error: [ %d ]", error);
		}

		this.network.matrix = this.network.m = best;
		console.log("End simulated annealing training.");

	},

	randomize: function(matrix, T) {
		matrix || (matrix = this.network.matrix.clone());
		// Randomize the weights.
		matrix.forEach(function(n) {
			var k, delta;
			// For every weight in each neuron, randomize the weights.
			for(k = 0; k < n.weights.length; k++) {
				// Calculate new random value.
				delta = 0.5 - Math.random();
				delta /= 10;
				delta *= T;
				// Change the weight.
				n.weights[k] += delta;
			}
		});
		// Return new matrix.
		return matrix;
	}

});