var _ = require("lodash");
var chalk = require("chalk");

var system = require("./system.js");

var backpropagation = module.exports = system.extend({

	initialize: function() {
		if(!this.options.learningRate) this.options.learningRate = 0.5;
		if(!this.options.momentum) this.options.momentum = 0.9;
	},

	// Default training function.
	train: function(inputs, ideals) {
		var i, j, sum, previousError, error = 1.0;

		var matrix = this.network.matrix;

		this.deltas = this.resetArray(matrix.weights);
		this.gradients = this.resetArray(matrix.weights);

		this.previousDeltas = [];
		this.previousGradients = [];

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

			// // At every 1000th iteration, ...
			if(!(i % 1000)) console.log("Error: [ %d ] %d", error, i);
		}

		// End training.
		console.log( chalk.yellow("Training finished in", i, "iterations.") );
		console.log( chalk.yellow("Error is at: ", error) );
		console.timeEnd("Training took");

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

