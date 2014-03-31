var _ = require("lodash");
var chalk = require("chalk");

var system = require("./system.js");

var boltzmann = module.exports = system.extend({

	initialize: function() {
		if(!this.options.learningRate) this.options.learningRate = 0.5;
		if(!this.options.momentum) this.options.momentum = 0.9;
	},

	train: function(inputs) {
		var i, j, energy = 1;

		console.log("Start training.");
		// console.log("weights", this.network.weights);
		for(i = 0; i < 2000; i++) {

			energy = 0.0;

			// For each input, ...
			for(j = 0; j < inputs.length; j++) {
				// Run a "reality" step. This step uses data given
				// by the user to create "real" associations.
				this.network.runVisible(inputs[j]);
				this.network.runHidden();
				// Save the associations to the positive associations array.
				this.positive = this.getAssociations();
				// Run a "dream" step. This step uses the expected
				// results based on the network's current configuration.
				this.network.runVisible();
				// Save the associations to the negative associations array.
				this.negative = this.getAssociations();
				// Finally, update the weights using the eqn:
				// W_ij += lr * ( pos(_ij) - neg(_ij) )
				this.updateWeights();

				// energy += this.network.calculateEnergy();
			}

			// energy = energy / inputs.length;

		}


		console.log("End training.");
		// console.log("weights", this.network.weights);
		// console.log("Energy: [ %d ]", energy);

	},

	updateWeights: function() {
		this.network.forEach(function(n, i, j) {
			if(i === 0) return;
			for(var k = 0; k < this.network.weights[i][j].length; k++) {
				// if(i==1 && j==0 && k==0) console.log("Wij(%d) += %d * (%d - %d)", this.network.weights[i][j][k], this.options.learningRate, this.positive[i][j][k], this.negative[i][j][k]);
				this.network.weights[i][j][k] += this.options.learningRate * (this.positive[i][j][k] - this.negative[i][j][k]);
				// if(i==1 && j==0 && k==0) console.log("= %d", this.network.weights[i][j][k]);
			}
		}, this);
	},

	getAssociations: function() {
		var i, j, k, result = [];
		for(i = 1; i < this.network.weights.length; i++) {
			result[i] = [];

			for(j = 0; j < this.network.weights[i].length; j++) {
				result[i][j] = [];
				// For each weight, ...
				for(k = 0; k < this.network.weights[i][j].length; k++) {
					result[i][j][k] = this.network.neurons[i-1][k].state * this.network.neurons[i][j].state;
				}
			}
		}
		// console.log("result", result);
		return result;
	}

});