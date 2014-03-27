var _ = require("lodash");
var chalk = require("chalk");

var extend = require("backbone-node").extend;

var system = module.exports = function(network, options) {
	this.network = network;
	this.options = _.defaults((options || {}), {
		iterations: 20000,
		threshold: 0.0001
	});

	this.initialize.apply(this, arguments);
};

system.extend = extend;

_.extend(system.prototype, {

	initialize: function() {},

	// Default training function.
	// Set up for propagation algorithms (backprop & rprop).
	// For other algorithms, train function must be overridden.
	train: function(inputs, ideals) {
		var i, j, sum, previousError, error = 1.0;

		var matrix = this.network.matrix;

		this.deltas = this.resetArray(matrix.weights);
		this.gradients = this.resetArray(matrix.weights);
		this.updates = this.resetArray(matrix.weights, 0.1);

		this.previousDeltas = [];
		this.previousGradients = [];
		this.previousUpdates = [];

		// Start training.
		console.log( chalk.red("Training started.") );
		console.time("Training took");

		// Cycle through inputs and ideal values to train network
		// and avoid the problem of catastrophic forgetting.

		// Train until error < threshold OR iterations = maximum
		for(i = 0; ((error > this.options.threshold) && (i < this.options.iterations)); i++) {
			// Run through all inputs and ideal values.
			sum = 0;

			// Reset arrays.
			this.previousGradients = this.cloneArray(this.gradients);
			this.previousDeltas = this.cloneArray(this.deltas);
			this.previousUpdates = this.cloneArray(this.updates);

			this.gradients = this.resetArray(this.gradients);
			this.deltas = this.resetArray(this.deltas);

			for(j = 0; j < inputs.length; j++) {
				// Run the network to populate values.
				this.network.matrix.run(inputs[j]);

				// Calculate gradients. (Batch mode)
				this.calculateNeuronDeltas(ideals[j]);
				this.calculateGradients(inputs[j]);
				// Calculate error.
				sum += matrix.calculateError(ideals[j]);

			}

			// Run a training iteration.
			this.calculateDeltas();
			// And finally, update the weights.
			this.updateWeights();

			// And calculate the batch error.
			error = sum / inputs.length;

			// // At every 100th iteration, ...
			if(!(i % 1000)) {
			// 	// If the error has remained relatively constant for 1000 iterations,
			// 	// use a genetic algorithm to randomize some of the neuron's weights
			// 	// if it has the highest error.
			// 	if(Math.abs(error - previousError) < 1e-7) {
			// 		this.randomize(error);
			// 	}
			// 	// Set the previous error value.
			// 	previousError = error;
			// 	// Display the current error.
				console.log("Error: [ %d ] %d", error, i);
			}
		}

		// End training.
		console.log( chalk.yellow("Training finished in", i, "iterations.") );
		console.log( chalk.yellow("Error is at: ", error) );
		console.timeEnd("Training took");

	},

	resetArray: function(array, value) {
		value || (value = 0);
		var result = Array.apply(null, new Array(array.length)).map(Number.prototype.valueOf, value);
		for(var i = 0; i < array.length; i++) {
			if(Array.isArray(array[i]))
				result[i] = this.resetArray(array[i], value);
		}
		return result;
	},

	cloneArray: function(array) {
		var result = array.slice();
		for(var i = 0; i < array.length; i++) {
			if(Array.isArray(array[i])) 
				result[i] = this.cloneArray(array[i]);
		}
		return result;
	},

	updateWeights: function() {
		this.network.matrix.forEach(function(n, i, j) {
			for(var k = 0; k < this.network.matrix.weights[i][j].length; k++) {
				// Add each delta value to every weight.
				this.network.matrix.weights[i][j][k] += this.deltas[i][j][k];
			}
		}, this);
	},

	calculateNeuronDeltas: function(ideals) {
		var i, j, k, n = this.network.matrix.neurons;

		var error;
		// For every 'level', working backwards...
		for(i = n.length-1; i >= 0; i--) {
			// For every neuron, ...
			for(j = 0; j < n[i].length; j++) {
				// Reset the error.
				error = 0.0;
				// If this is the last layer, the error is the difference between
				// the ideal and the actual output values of the last neuron.
				if(!n[i+1]) {
					error = ideals[j] - n[i][j].output;
				}
				// Otherwise, the error is the sum of the weights multiplied by
				// the corresponding neuron's delta value.
				else {
					// The index of this neuron is j,
					// therefore, the corresponding weights will also be at j.

					// So for each neuron in the following layer, ...
					for(k = 0; k < n[i+1].length; k++) {
						error += this.network.matrix.weights[i+1][k][j] * n[i+1][k].delta;
					}
				}

				// Assign error to neuron.
				n[i][j].previousError = n[i][j].error;
				n[i][j].error = error;
				// Assign delta to neuron.
				n[i][j].delta = n[i][j].derivative() * error;

			}

		}
	},

	calculateGradients: function(inputs) {
		// Working forwards, after all partial derivatives have been calculated, ...
		this.network.matrix.forEach(function(n, i, j) {
			// Set up gradient values for the future.
			// Gradients are the derivatives w/r to the weights.
			// Gradients = neuron delta * output of previous neuron.
			for(k = 0; k < this.gradients[i][j].length; k++) {
				this.gradients[i][j][k] += n.delta * ((i > 0) ? this.network.matrix.neurons[i-1][k].output : inputs[k]);
			}
		}, this);

	}
	
});