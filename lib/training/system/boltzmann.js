var _ = require("lodash");
var chalk = require("chalk");

var system = require("./system.js");

var boltzmann = module.exports = system.extend({

	initialize: function() {
		if(!this.options.learningRate) this.options.learningRate = 0.5;
		if(!this.options.momentum) this.options.momentum = 0.9;
	},

	train: function(inputs) {

	}

});