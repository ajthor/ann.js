// Backpropagation
// ===============


// Require underscore.
var _ = require("underscore");

var chalk = require("chalk");

// Import matrix class.
var Matrix = require("matrix");
// Import system class.
var system = require("../system.js");

// Backpropagation Training System 
// ===============================
var anneal = module.exports = system.extend({

	initialize: function(network, options) {
		// Set defaults specific to the annealing object, such as 
		// temperature and step function.
		this.options = _.defaults((options || {}), {
			iterations: 10,
			learningRate: 0.5,
			momentum: 0.9
		}, this.options);

		this.deltas = [];
		this.gradients = [];

		this.previousDeltas = [];
		this.previousGradients = [];

		for(var i = 0; i < this.network.weights.length; i++) {
			this.deltas[i] = new Matrix(this.network.weights[i].dimensions);
			this.gradients[i] = new Matrix(this.network.weights[i].dimensions);

			this.previousDeltas[i] = new Matrix(this.network.weights[i].dimensions);
			this.previousGradients[i] = new Matrix(this.network.weights[i].dimensions);
		}

	},

	train: function(inputs, ideals) {
		var i, j, len, sum;

		var error = 1;

		len = inputs.length;

		// Start training.
		console.log( chalk.red("Training started.") );
		console.time("Training took");

		// Cycle through inputs and ideal values to train network
		// and avoid the problem of 'catastrophic forgetting'.

		// Train until `error` < `threshold` 
		// OR until `iterations` = maximum
		for(i = 0; ((error > this.options.threshold) && (i < this.options.iterations)); i++) {

			sum = 0;

			// To begin, reset the delta and gradient matrices to 
			// zero and store the results of the last pass in 
			// 'previous' matrices.
			for(j = 0; j < this.network.weights.length; j++) {
				this.previousDeltas[j].copy(this.deltas[j]);
				this.previousGradients[j].copy(this.gradients[j]);

				this.deltas[j].zero();
				this.gradients[j].zero();
			}

			// Batch train the network by calculating the batch 
			// gradient and the batch error.
			for(j = 0; j < len; j++) {
				this.network.run(inputs[j]);
				this.calculateGradients(inputs[j], ideals[j]);
				sum += this.network.error(ideals[j]);
			}

			this.calculateDeltas();

			this.updateWeights();

			error = sum / len;
		}

		// End training.
		console.log( chalk.yellow("Training finished in", i, "iterations.") );
		console.log( chalk.yellow("Error is at: ", error) );
		console.timeEnd("Training took");

	},

	// Calculate Deltas
	// ----------------
	calculateDeltas: function() {
		for(var i = 0; i < this.deltas.length; i++) {
			this.deltas[i].map(function(value, row, col) {
				// Modify the delta by multiplying the derivative by 
				// the learning rate and adding the momentum value 
				// multiplied by the previous delta.
				value = this.options.learningRate * this.gradients[i].value[row][col];
				value += this.options.momentum * this.previousDeltas[i].value[row][col];

				return value;
			}, this);
		}
	},

	// Calculate Gradients
	// -------------------
	// Calculate the error of each, individual neuron in the network.
	calculateGradients: function(inputs, ideals) {
		var i, len, weights_arr, sum;
		var e_last = [],
			e_current;

		weights_arr = this.network.weights;

		// The output neuron's error signals are just the ideal 
		// output minus what we actually got.
		this.network.output.forEach(function(value, row, col) {
			e_last[row] = ideals[row] - value;
		});

		// Start by calculating the error signal on each preceeding 
		// neuron. The error signal is the weights emanating from 
		// this neuron multiplied by the connected neuron's 
		// error signal.
		for(i = weights_arr.length-1; i >= 0; i--) {

			e_current = Array.apply(null, new Array(weights_arr[i].rows)).map(Number.prototype.valueOf,0);;
			
			console.log(e_last);

			weights_arr[i].T.forEach(function(weight, row, col) {
				
			});

			console.log(e_current);
			e_last = e_current.slice();

		}
	},

	// Update Weights
	// --------------
	// Update each individual weight in the network by adding the 
	// delta values to the respective weights.
	updateWeights: function() {
		for(var i = 0; i < this.network.weights.length; i++) {
			this.network.weights[i].map(function(weight, row, col) {

				return weight + this.deltas[i].value[row][col];

			}, this);
		}
	}

});