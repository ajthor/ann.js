var _ = require("lodash");
var chalk = require("chalk");

var system = require("./system.js");

var rprop = module.exports = system.extend({

	train: function(inputs, ideals) {
		var i, j, sum, Ebest = 1, E, error = 1.0;

		var clone, network = this.network.clone();
		best = network.clone();

		// Set initial temperature.
		var T = this.options.initialTemperature || 10;
		
		// Probability function.
		var P;

		// Start training.
		console.log( chalk.red("Training started.") );
		console.time("Training took");

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

			// Clone the best network.
			clone = best.clone();
			// NOTE: Not sure if this is technically the correct annealing 
			// algorithm. I decided to set the starting network to the best network.
			// I did this because by setting it to the current network,
			// the algorithm failed to converge about 99% of the time.
			// After the change, the algorithm converges 100% of the time with
			// current temperature values.

			// First, randomize the weights.
			clone = this.randomize(clone, T);

			// For each input, anneal the network.
			for(j = 0; j < inputs.length; j++) {

				// Run the network to calculate outputs.
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
				network = clone;

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
					network = clone;
				}

			}



			// Reduce T by some value.
			T -= 0.00001;

			// if(!(i%1000)) console.log("Error: [ %d ]", error);
		}

		this.network.copy(best);

		// End training.
		console.log( chalk.yellow("Training finished in", i, "iterations.") );
		console.log( chalk.yellow("Error is at:", error) );
		console.timeEnd("Training took");

	},

	randomize: function(network, T) {
		network || (network = this.network.clone());
		// Randomize the weights.
		network.forEach(function(n, i, j) {
			var k, delta;
			// For every weight in each neuron, randomize the weights.
			for(k = 0; k < network.weights[i][j].length; k++) {
				// Calculate new random value.
				delta = 0.5 - Math.random();
				delta /= 10;
				delta *= T;
				// Change the weight.
				network.weights[i][j][k] += delta;
			}
		});
		// Return new network.
		return network;
	}

});