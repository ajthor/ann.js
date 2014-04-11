// Simulated Annealing
// ===================
// Simulated annealing works by simulating a natural process of 
// randomizing the weights in order to converge on a more ideal 
// solution. This randomization, coupled with 'cooling' over time, 
// can be used for training a neural network's weights. Generally, 
// this randomization takes more iterations than backpropagation, but 
// will converge more often and faster than backprop algorithms.

// Require underscore.
var _ = require("underscore");

var chalk = require("chalk");

// Import system class.
var system = require("../system.js");

// Simulated Annealing Training System 
// ===================================
var anneal = module.exports = system.extend({

	initialize: function(network, options) {
		// Set defaults specific to the annealing object, such as 
		// temperature and step function.
		this.options = _.defaults((options || {}), {
			temperature: 100,
			step: function(T) {return (T - 1e-3);}
		}, this.options);
	},

	// Train Function
	// --------------
	train: function(inputs, ideals) {
		var i, j, len, sum, P,
			e_current = 1, 
			e_best = 1, 
			e_neighbor = 1;

		var neighbor,
			current = this.network.clone(),
			best = this.network.clone();

		var T = this.options.temperature;

		len = inputs.length;

		// Start training.
		console.log( chalk.red("Training started.") );
		console.time("Training took");

		for(i = 0; ((e_best > this.options.threshold) && (T > 0)); i++) {

			e_current = e_neighbor;

			sum = 0;

			neighbor = best.clone();
			// NOTE: Not sure if this is technically the correct 
			// annealing algorithm. I decided to set the starting 
			// network to the best network. I did this because by 
			// setting it to the current network, the algorithm 
			// failed to converge about 99% of the time. After the 
			// change, the algorithm converges 100% of the time with 
			// current temperature values.

			this.randomize(neighbor, T);

			// For each input provided to the training function, run 
			// through each input and calculate the batch error for 
			// all training inputs.
			for(j = 0; j < len; j++) {
				neighbor.run(inputs[j]);
				sum += neighbor.error(ideals[j]);
			}

			e_neighbor = sum / len;


			if(e_neighbor < e_current) {

				current = neighbor;

				// This means the solution jumped to is the best 
				// solution thus far, with the lowest total error. 
				// Accept this solution automatically as the new best.
				if(e_neighbor < e_best) {

					console.log("Error: [ %d ] %d", e_best, i);

					e_best = e_neighbor;
					best = neighbor;
				}
			}
			// If it's not necessarily better, check if it's possible 
			// to jump to this less-than-ideal solution.
			else {
				P = Math.exp( (e_current - e_neighbor) / T );

				if(P > Math.random()) {
					current = neighbor;
				}
			}

			T = this.options.step(T);
		}

		this.network.copy(best);

		// End training.
		console.log( chalk.yellow("Training finished in", i, "iterations.") );
		console.log( chalk.yellow("Error is at:", e_best) );
		console.timeEnd("Training took");
	},

	// Randomize Function
	// ------------------
	// Function to randomize the weights in a neural network. Uses 
	// the current temperature value and the starting temperature 
	// value to calculate the delta values.
	randomize: function(network, T) {
		var i, len;
		for(i = 0, len = network.weights.length; i < len; i++) {

			network.weights[i].map(function(weight) {
				
				var delta = 0.5 - Math.random();
				delta /= this.options.temperature;
				delta *= T;

				return weight + delta;
			}, this);
		}
	}
});