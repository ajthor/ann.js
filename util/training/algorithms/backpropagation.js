var _ = require("lodash");
var system = require("../system/system.js");

var backpropagation = module.exports = system.extend({

	initialize: function() {
		if(!this.options.learningRate) this.options.learningRate = 0.5;
		if(!this.options.momentum) this.options.momentum = 0.9;
	},

	_iteration: function(input, ideal) {
		try {
			var i, j, k;
			var neuron, output;
			// Begin backpropagation.

			// Once all gradients are calculated, work forward and calculate
			// the new weights. w = w + (lr * df/de * in)
			for(i = 0; i < this.network._layers.length; i++) {
				// For each neuron in each layer, ...
				for(j = 0; j < this.network._layers[i]._neurons.length; j++) {
					neuron = this.network._layers[i]._neurons[j];
					// Modify the bias.
					neuron.weights[0] += this.options.learningRate * neuron.gradients[0];
					// For each weight, ...
					for(k = 1; k < neuron.weights.length; k++) {
						// Modify the weight by multiplying the weight by the
						// learning rate and the input of the neuron preceding.
						// If no preceding layer, then use the input layer.
						neuron.gradients[k] *= (this.network._layers[i-1] ? this.network._layers[i-1]._neurons[k-1].output : input[k-1]);
						neuron.deltas[k] = this.options.learningRate * neuron.gradients[k];
						neuron.weights[k] += neuron.deltas[k];
						neuron.weights[k] += this.options.momentum * neuron.previousDeltas[k];

						// if((i==0) && (j==0) && (k==1)) console.log(neuron);

					}
					// Set previous delta values.
					neuron.previousDeltas = neuron.deltas.slice();

				}
			}

		} catch(e) {
			console.log("Error:", e.stack);
		}
	}


});


