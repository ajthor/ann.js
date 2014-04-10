// ann.js
// ======

// Artificial Neural Network library written in JavaScript and 
// CoffeeScript, implementing several neural network architectures,  
// such as multi-layer perceptrons, boltzmann machines, and deep 
// learning networks.

// Require underscore.
var _ = require("underscore");
// Require backbone-node (for inheritance).
var extend = require("backbone-node").extend;

// Network Class
// =============
// The meat and potatoes of the ann.js library. This is the base class 
// for many of the implementations and architectures seen in this 
// library.
var network = module.exports = function(config, options) {
	if(!(this instanceof network)) return new network(config, options);
	if(!(Array.isArray(config)) || (config === null))
		throw "Must supply an Array configuration to the network.";

	this.config = config;

	this.options = _.defaults((options || {}), {
		// Default activation function is a Sigmoid activation 
		// function. If you wish to change this to a hyperbolic 
		// tangent function instead, pass a callback as the 
		// `options.activation` property. *__NOTE:__ If you change 
		// the activation function, you also need to change the 
		// derivative function.*
		activation: function(x) {return (1 / (1 + Math.exp(-x)));},
		derivative: function() {return (this.output * (1 - this.output));},
		// By default, the network assumes there is a bias.
		hasBias: true
	});

	this.activation = this.options.activation;
	this.derivative = this.options.derivative;

	this.initialize(config, options);
};
// Set up inheritance for the network object using backbone.js style 
// inheritance. The extend function is very similar (if not an almost 
// exact copy) of the extend function used in backbone.js projects.
network.extend = extend;

_.extend(network.prototype, {
	// Prototype Methods
	// -----------------
	// Each network pattern will override the initialize and run 
	// functions and implement their own.  
	initialize: function(config, options) {},

	run: function(input) {},

	clone: function() {
		var clone = new this.constructor(this.config, this.options);
		clone.copy(this);

		return clone;
	},

	copy: function(network) {
		this.weights = [];
		for(var i = 0; i < network.weights.length; i++) {
			this.weights[i] = network.weights[i].clone();
		}
	}
});