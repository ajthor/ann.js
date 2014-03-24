var _ = require("lodash");
var neuron = require("./neuron.js");

var bias = module.exports = neuron.extend({
	initialize: function() {
		this.weights = [];

		this.updates = [];

		this.deltas = [];
		this.previousDeltas = [];
		
		this.input = undefined;
		this.output = 1;
	},

	parse: function(input) {
		for(var i = 0; i < input.length; i++) {
			if(!this.weights[i]) {
				this.weights[i] = 1;
				this.updates[i] = 0;
				this.deltas[i] = 0;
			}
		}
		return this.output;
	}
});