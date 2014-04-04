var _ = require("lodash");

var network = require("./lib/network/network.js");
var training = require("./lib/training/training.js");

var ann = module.exports = function(configuration, options) {
	if(!(this instanceof ann)) return new ann(configuration, options);
	// Set default options.
	this.options = _.defaults((options || {}), {
		// Set default network to be a feed-forward network.
		network: network.perceptron,
		// Set default training system to an annealing system.
		trainingSystem: training.anneal
	});

	// Single layer with 2 neurons and 1 output neuron.
	if(!configuration) configuration = [2, 1];

	// If network pattern is uninstantiated, instantiate it.
	if(!(this.options.network instanceof network.pattern)) {
		this.network = new this.options.network(configuration, options);
	}
	else {
		this.network = this.options.network;
	}

	// If training system is uninstantiated, instantiate it.
	if(!(this.options.trainingSystem instanceof training.system)) {
		this.trainingSystem = new this.options.trainingSystem(this.network);
	}
	else {
		this.trainingSystem = this.options.trainingSystem;
	}
	
	// Initialize network.
	this.initialize(configuration, options);
};

_.extend(ann.prototype, {
	initialize: function() {},

	run: function(input) {
		try {
			// Force array type.
			if(!Array.isArray(input)) input = [input];
			// Clone input so as not to mess with original array.
			// Pass input into network.
			return this.network.run(input.slice());

		} catch(e) {
			console.error("Error:", e.stack);
		}
	},

	train: function() {
		if(!this.options.trainingSystem) throw new Error("Must first specify a training system.");
		// Pass arguments along to the training system's train function.
		return this.trainingSystem.train.apply(this.trainingSystem, arguments);
	}

});