var _ = require("lodash");

var pattern = require("./pattern.js");

var bias = require("../bias.js");
var neuron = require("../neuron.js");

var boltzmann = module.exports = pattern.extend({

	initialize: function(configuration, options) {
		var i, j;
		// Set up neuron matrix.
		for(i = 0; i < configuration.length; i++) {
			this.neurons[i] = [];
			// For this layer, create new neurons.
			for(j = 0; j < configuration[i]; j++) {
				this.neurons[i][j] = new neuron();
			}
			// If 'hasBias' option is set, create a bias neuron.
			if(this.options.hasBias) {
				this.neurons[i].push(new bias());
			}
		}

		// For each layer, starting with the 
		// second layer, create new weights.

		// NOTE: To keep array looking nice, we expect the 
		// weights arrays to be shifted over 1 space to the left.
		// That means the 'input' to neuron (1,0) will be 
		// weights array (0,0), and the input back will be the 
		// transposed matrix of weights for the 0 layer.
		for(i = 1; i < this.neurons.length; i++) {
			this.weights[i] = [];
			for(j = 0; j < this.neurons[i].length; j++) {
				// Create empty weights array.
				// Will be populated during the first run.
				this.weights[i][j] = [];
			}
		}

	},

	run: function(input) {
		var i, j, k, result = [];
		var transposed;
		// Copy the input array to avoid changes to the original.
		// Set it to be the 'input' layer.
		result[0] = input.slice();

		// Start by setting the state activations of the visible [i=0] neurons
		// and getting the state of those same neurons (this accounts for bias).
		for(j = 0; j < this.neurons[0].length; j++) {
			if(result[0][j]) this.neurons[0][j].state = result[0][j];
			result[0][j] = this.neurons[0][j].state;
		}

		// Moving forward, pass the output of the neurons from the
		// visible layer to the subsequent hidden layer.

		// Starting at the second layer, ...
		for(i = 1; i < this.neurons.length; i++) {
			result[i] = [];
			// For each neuron.
			for(j = 0; j < this.neurons[i].length; j++) {
				// Run each neuron using weights array corresponding to it.
				// NOTE: For first run, weights array will be empty until after this line.
				this.neurons[i][j].run(result[i-1], this.weights[i][j]);
				// Get the state of each neuron.
				result[i][j] = this.neurons[i][j].state;
			}
		}

		// console.log("CURRENT WEIGHTS\n", this.weights[1]);
		// console.log("TRANSPOSED WEIGHTS\n", _.zip.apply(_, this.weights[1]));

		// Get the state of the last layer.
		for(j = 0; j < this.neurons[this.neurons.length-1].length; j++) {
			result[this.neurons.length-1][j] = this.neurons[this.neurons.length-1][j].state;
		}

		// Running backwards now, starting at the second to the last layer.
		for(i = this.neurons.length-2; i >= 0; i--) {
			for(j = 0; j < this.neurons[i].length; j++) {
				// Run each neuron with the transpose of the weights array
				// corresponding to this neuron.
				this.neurons[i][j].run(result[i+1], _.zip.apply(_, this.weights[i+1])[j] );
				// Get the state of each neuron.
				result[i][j] = this.neurons[i][j].state;
			}
		}

		return result;

	}

});


