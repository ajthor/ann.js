var _ = require("lodash");

var bias = require("./bias.js");
var neuron = require("./neuron.js");

var matrix = module.exports = function matrix(configuration, options) {
	this.options = _.defaults((options || {}), {
		configuration: configuration,
		hasBias: true
	});

	// Create empty matrix array.
	this.neurons = this.n = [];

	this.initialize(configuration, options);
};

_.extend(matrix.prototype, {
	initialize: function(configuration, options) {
		var i, j;
		// Set up matrix.
		for(i = 0; i < configuration.length; i++) {
			this.n[i] = [];
			// For this layer, create new neurons.
			for(j = 0; j < configuration[i]; j++) {
				this.n[i][j] = new neuron();
			}
			// If 'hasBias' options is set, create a bias neuron.
			if((this.options.hasBias) && (i < configuration.length-1)) {
				this.n[i].push(new bias());
			}
		}
	},

	forEach: function(cb, handler) {
		try {
			if(!cb) throw new Error("Must supply a callback to the 'forEach' function.");
			handler || (handler = this);
			var i, j;
			for(i = 0; i < this.n.length; i++) {
				for(j = 0; j < this.n[i].length; j++) {
					cb.call(handler, this.n[i][j], i, j);
				}
			}
		} catch(e) {
			console.log("Error:", e.stack);
		}
	},

	clone: function() {
		var clone = new this.constructor(this.options.configuration, this.options);
		this.forEach(function(n, i, j) {
			for(var k = 0; k < n.weights.length; k++) {
				clone.n[i][j].weights[k] = n.weights[k];
			}
		});
		return clone;
	},

	parse: function(input) {
		var i, j, result = [];
		// Copy the input array to avoid changes to the original.
		// Set it to be the 'input' layer.
		result[-1] = input.slice();

		// For every 'layer', ...
		for(i = 0; i < this.n.length; i++) {
			// Assign a value to the result array.
			result[i] = [];
			for(j = 0; j < this.n[i].length; j++) {
				result[i][j] = this.n[i][j].parse(result[i-1]);
			}
		}

		// console.log("RESULT", result);

		return result[i-1];
	}
});