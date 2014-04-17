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
		this.outputs = [];

		var i, bias;
		for(i = config.length-1; i--; ) {

			this.weights[i] = new Matrix([config[i+1], config[i]]);
			this.weights[i].map(function(val) {
				return Math.random();
			});

			if(this.options.hasBias) {
				bias = new Matrix([this.weights[i].rows, 1]);
				bias.zero(1);

				this.weights[i] = Matrix.join(this.weights[i], bias);

			}

			this.outputs[i] = new Matrix([config[i+1], 1]);

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

		var i, len, row, col, sum;

		this.outputs[-1] = new Matrix([input]).T;

		for(i = 0, len = this.weights.length; i < len; i++) {

			sum = this.weights[i].clone();

			sum.map(function(weight, row, col) {
				if(col > this.outputs[i].cols) return weight;
				return weight * this.outputs[i-1].value[col][0];
			}, this);
			sum = sum.sum();

			this.outputs[i] = sum.clone();
			this.outputs[i].map(function(weight) {
				return this.activation(weight);
			}, this);

		}

		return this.outputs[i-1];


	},

	// Perceptron Error Function
	// -------------------------
	// Standard sum squared error function.
	error: function(ideal) {
		var error = 0.0;
		var last = this.outputs[this.outputs.length-1];
		last.forEach(function(value, row, col) {
			error += Math.pow((ideal[row] - value), 2);
		});

		return error;
	}

});