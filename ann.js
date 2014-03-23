var _ = require("lodash");

var neuron = require("./util/static/neuron.js");
var matrix = require("./util/static/matrix.js");

var system = require("./util/training/training.js").system;

// Network Object
// --------------
var network = module.exports = function(count, options) {
	if(!(this instanceof network)) return new network(count, options);
	// Set default options.
	this.options = _.defaults((options || {}), {
		// Set default training system to a backpropagation system.
		trainingSystem: require("./util/training/training.js").backprop
	});
	// If training system is uninstantiated, instantiate it.
	if(!(this.options.trainingSystem instanceof system)) {
		this.options.trainingSystem = new this.options.trainingSystem(this);
	}
	// Initialize network.
	if(!count) count = [2, 1]; // Single layer with 2 neurons and 1 output neuron.

	this.initialize(count, options);
};

_.extend(network.prototype, {
	initialize: function(count, options) {
		try {

			this.matrix = new matrix(count, options);
			
		} catch(e) {
			console.log("Error:", e.stack);
		}
	},

	parse: function(input) {
		try {
			// Force array type.
			if(!Array.isArray(input)) input = [input];
			// Clone input so as not to mess with original array.
			var result = input.slice();
			// Pass input into first layer.
			// And then the result of that layer into each subsequent layer.
			for(var i = 0, len = this.layers.length; i < len; i++) {
				result = this.layers[i].parse(result);
			}

			return result;

		} catch(e) {
			console.log("Error:", e.stack);
		}
	},

	train: function() {
		// Pass arguments along to the training system's train function.
		return this.options.trainingSystem.train.apply(this.options.trainingSystem, arguments);
	}

});