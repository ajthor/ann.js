// Training System
// ===============
// Training system object which serves as the parent class for the 
// training systems for different architectures.

// Require underscore.
var _ = require("underscore");
// Require backbone-node (for inheritance).
var extend = require("backbone-node").extend;

// Import network class.
var ann = require("../../../ann.js");

// System Class 
// ============
// Where the magic happens. Pass the system a network object and it 
// will look for a weights array within it to train.
var system = module.exports = function(network, options) {
	if(!(this instanceof system)) return new system(network);
	if(!(network instanceof ann)) {
		console.warn("WARNING: Training object should be an instance of \'network\'.");
		if((typeof network.weights === 'undefined') || (network.weights === null)) {
			throw "Must supply a trainable object with an array of matrices to training system.";
			return null;
		}
	}
	else {
		this.network = network;
	}

	this.options = _.defaults((options || {}), {
		// The maximum number of iterations a training system will 
		// run if it does not converge.
		iterations: 2000,
		// The default threshold is an error rate to three decimal 
		// places. Decrease this number for a more accurate result.
		threshold: 1e-3
	});

	this.initialize(network, options);
};
// Set up inheritance for the system object.
system.extend = extend;

_.extend(system.prototype, {
	// Prototype Methods
	// -----------------
	// Overridable methods which make up the system interface.
	initialize: function(network, options) {},
	train: function(inputs, ideals) {}
});