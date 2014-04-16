
// Require underscore.
var _ = require("underscore");

// Import network and matrix objects.
var network = require("../../ann.js");

var Matrix = require("matrix");

// Restricted Boltzmann Machine Object
// ===================================

var boltzmann = module.exports = network.extend({
	// Boltzmann Initialize Function
	// -----------------------------
	// Boltzmann initialize function sets up weights matrices and 
	// applies the biases to the matrices if the `hasBias` option is 
	// set to `true`.
	initialize: function(config, options) {
		this.weights = [];

		var i, row, col, bias;
		for(i = 0, len = config.length-1; i < len; i++) {

			this.weights[i] = new Matrix([config[i+1], config[i]]);
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

	},

	set: function(layer, input) {
		if((typeof input !== 'undefined') && (input !== null)) {
			input = input.slice();
		}
		else {
			throw "Must supply an input to the \'run\' function.";
			return null;
		}


	},

	// Boltzmann Error Function
	// ------------------------
	// Standard sum squared error function.
	error: function(ideal) {
		var error = 0.0;
		this.output.forEach(function(value, row, col) {
			error += Math.pow((ideal[row] - value), 2);
		});

		return error;
	}
});