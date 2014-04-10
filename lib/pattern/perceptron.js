// Multi-Layer Perceptron Class
// ============================
// Extends `network` class. Implementation of a multi-layer, 
// feed-forward neural network. Can increase the size of the network 
// to almost any size, but be careful when using certain training 
// methods with large networks.

// Require underscore.
var _ = require("underscore");

// Import network and matrix objects.
var network = require("../../ann.js");

var Matrix = require("matrix");

// Perceptron Object
// =================

var perceptron = module.exports = network.extend({
	// Perceptron Initialize Function
	// ------------------------------
	// Perceptron initialize function sets up weights matrices and 
	// applies the biases to the matrices if the `hasBias` option is 
	// set to `true`.
	initialize: function(config, options) {
		this.weights = [];

		var i, row, col, bias;
		for(i = 0, len = config.length-1; i < len; i++) {

			this.weights[i] = new Matrix([config[i+1], config[i]]);
			console.log(this.weights[i].dimensions);
			this.weights[i].map(function(val) {
				return Math.random();
			});

			if(this.options.hasBias) {
				bias = new Matrix([this.weights[i].rows, 1]);
				bias.zero(1);

				this.weights[i] = Matrix.join(this.weights[i], bias);

			}

		}

	},

	run: function(input) {
		if((typeof input !== 'undefined') && (input !== null)) {
			input = input.slice();
		}
		else {
			throw "Must supply an input to the \'run\' function.";
			return null;
		}

		console.log(this.weights[0].dimensions,
					this.weights[1].dimensions,
					this.weights[2].dimensions);

		var i, len, sum, output;

		output = new Matrix([input]).T;

		for(i = 0, len = this.weights.length; i < len; i++) {

			sum = this.weights[i].clone();

			sum.map(function(weight, row, col) {
				return weight * output.value[row][0];
			});
			sum = sum.sum();
			
			output = sum.clone();
			output.map(function(weight) {
				return this.activation(weight);
			}, this);

		}

		this.output = output;

		return output;


	},

	error: function(ideal) {
		var error = 0.0;
		this.output.forEach(function(value, row, col) {
			error += Math.pow((ideal[row] - value), 2);
		});

		return error;
	}

});