var _ = require("lodash");

var bias = require("../bias.js");
var neuron = require("../neuron.js");

var extend = require("backbone-node").extend;

var pattern = module.exports = function pattern(configuration, options) {
	this.options = _.defaults((options || {}), {
		configuration: configuration,
		hasBias: true
	});

	// Create empty matrix array.
	this.neurons = [];
	// Create empty array of weights.
	this.weights = [];

	this.initialize(this.options.configuration, options);
};

pattern.extend = extend;

_.extend(pattern.prototype, {

	initialize: function() {},

	run: function() {},

	calculateError: function(ideal) {
		var error = 0.0;
		var last = this.neurons[this.neurons.length-1];
		// For every neuron in the last layer, ...
		for(var i = 0; i < last.length; i++) {
			// Calculate total error.
			error += Math.pow(( ideal[i] - last[i].output ), 2);
		}
		return error;
	},

	forEach: function(cb, handler) {
		try {
			if(!cb) throw new Error("Must supply a callback to the 'forEach' function.");
			handler || (handler = this);
			var i, j;
			for(i = 0; i < this.neurons.length; i++) {
				for(j = 0; j < this.neurons[i].length; j++) {
					cb.call(handler, this.neurons[i][j], i, j);
				}
			}
		} catch(e) {
			console.log("Error:", e.stack);
		}
	},

	clone: function() {
		// Create new matrix object.
		var clone = new this.constructor(this.options.configuration, this.options);
		// Copy weights from this object to the clone.
		this.forEach(function(n, i, j) {
			clone.weights[i][j] = this.weights[i][j].slice();
		});

		return clone;
	},

	copy: function(network) {
		this.forEach(function(n, i, j) {
			this.weights[i][j] = network.weights[i][j].slice();
		});
	}
	
});


