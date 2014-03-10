var _ = require("lodash");
var neuron = require("./static.js").neuron;
var layer = require("./static.js").layer;

var system = require("./util/training/training.js").system;
var backpropSystem = require("./util/training/training.js").backpropagation;
// Network Class
// -------------
var network = module.exports = function(neurons, options) {
	if(!(this instanceof network)) return new network(neurons, options);
	// Set default options.
	this.options = _.defaults((options || {}), {
		// Set default training system to a backpropagation system.
		trainingSystem: backpropSystem
	});
	// If training system is uninstantiated, instantiate it.
	if(!(this.options.trainingSystem instanceof system)) {
		this.options.trainingSystem = new this.options.trainingSystem(this);
	}
	// Initialize network.
	if(!neurons) neurons = [2, 1]; // Single layer with 2 neurons and 1 output neuron.
	this.initialize(neurons);
};

_.extend(network.prototype, {
	initialize: function(neurons) {
		try {
			if(!Array.isArray(neurons)) neurons = [neurons];
			// Create layers array.
			this._layers = new Array(neurons.length);
			// For each layer, ...
			for(var i = 0, len = neurons.length; i < len; i++) {
				// Initialize
				this._layers[i] = new layer();
				// Populate with n new neurons.
				for(j = 0; j < neurons[i]; j++) {
					this._layers[i]._neurons.push(new neuron());
				}
			}
		} catch(e) {
			console.log("Error:", e.stack);
		}
	},

	input: function(input) {
		try {
			// Force array type.
			if(!Array.isArray(input)) input = [input];
			// Clone input so as not to mess with original array.
			var result = input.slice();
			// Pass input into first layer.
			// And then the result of that layer into each subsequent layer.
			for(var i = 0, len = this._layers.length; i < len; i++) {
				result = this._layers[i].parse(result);
			}

			// console.log(result);
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