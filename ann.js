var _ = require("lodash");

var matrix = require("./util/static/matrix.js");
var system = require("./util/training/training.js").system;

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
	this.matrix = new matrix(count, options);

	this.initialize(count, options);
};

_.extend(network.prototype, {
	initialize: function() {},

	run: function(input) {
		try {
			// Force array type.
			if(!Array.isArray(input)) input = [input];
			// Clone input so as not to mess with original array.
			// Pass input into matrix.
			return this.matrix.run(input.slice());

		} catch(e) {
			console.error("Error:", e.stack);
		}
	},

	train: function() {
		// Pass arguments along to the training system's train function.
		return this.options.trainingSystem.train.apply(this.options.trainingSystem, arguments);
	}

});