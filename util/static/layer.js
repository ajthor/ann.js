var _ = require("lodash");

var bias = require("./bias.js");
var neuron = require("./neuron.js");

var layer = module.exports = function layer(count, options) {
	this.options = _.defaults((options || {}), {
		// By default, layer has a bias.
		hasBias: true
	});

	// Make an empty array of neurons.
	this.neurons = [];

	this.initialize(count, options);
};

_.extend(layer.prototype, {
	initialize: function(count, options) {
		// Initialize layer with neurons.
		for(var i = 0; i < count; i++) {
			this.neurons.push(new neuron(options));
		}
		// Add in bias if it needs it.
		if(this.options.hasBias) {
			this.neurons.push(new bias(options));
		}

	},

	parse: function(input) {
		var result = [];
		// For each neuron in layer, ...
		for(var i = 0, len = this.neurons.length; i < len; i++) {
			// Push a result value to an output array.
			result[i] = this.neurons[i].parse(input);
		}
		// Return result array.
		return result;
	}

});

