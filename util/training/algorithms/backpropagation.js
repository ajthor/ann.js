var _ = require("lodash");
var system = require("../system/system.js");

var backpropagation = module.exports = system.extend({

	_iteration: function(input, ideal) {
		try {
			var i, j, k;
			var neuron, output;
			// Begin backpropagation.

			// Calculate gradients.
			this.calculateGradients(ideal);

			// Once all gradients are calculated, work forward and calculate
			// the new weights. w = w + (lr * df/de * in)
			for(i = 0; i < this.network._layers.length; i++) {
				// For each neuron in each layer, ...
				for(j = 0; j < this.network._layers[i]._neurons.length; j++) {
					neuron = this.network._layers[i]._neurons[j];
					// Modify the bias.
					neuron.weights[0] += this.network.options.learningRate * neuron.gradient;
					// For each weight, ...
					for(k = 1; k < neuron.weights.length; k++) {
						// Modify the weight by multiplying the weight by the
						// learning rate and the input of the neuron preceding.
						// If no preceding layer, then use the input layer.
						neuron.deltas[k] = this.network.options.learningRate * neuron.gradient * (this.network._layers[i-1] ? this.network._layers[i-1]._neurons[k-1].output : input[k-1]);
						neuron.weights[k] += neuron.deltas[k];
						neuron.weights[k] += this.network.options.momentum * neuron.previousDeltas[k];

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


