var _ = require("lodash");
var system = require("../system.js");

var rprop = module.exports = system.extend({

	sign: function(num) {
		if(Math.abs(num) < 1e-10) return 0;
		// if(num === 0) return 0;
		if(num > 0) return 1;
		return -1;
	},

	calculateDeltas: function() {
		try {

			var positiveStep = 1.2;
			var negativeStep = 0.5;

			this.network.matrix.forEach(function(n, i, j) {
				var change;

				for(var k = 0; k < this.network.matrix.weights.length; k++) {
					// Calculate the sign change.
					change = this.sign(this.gradients[i][j][k] * this.previousGradients[i][j][k]);

					// IRPROP+
					if(change > 0) {

						this.updates[i][j][k] = Math.min((this.previousUpdates[i][j][k] * positiveStep), 50);
						this.deltas[i][j][k] = this.sign(this.gradients[i][j][k]) * this.updates[i][j][k];
						this.previousGradients[i][j][k] = this.gradients[i][j][k];

					}
					else if(change < 0) {

						this.updates[i][j][k] = Math.max((this.previousUpdates[i][j][k] * negativeStep), 1e-6);
						if(n.error > n.previousError) this.deltas[i][j][k] = -1 * this.previousDeltas[i][j][k];
						this.previousGradients[i][j][k] = 0;

					}
					else {

						this.deltas[i][j][k] = this.sign(this.gradients[i][j][k]) * this.updates[i][j][k];
						this.previousGradients[i][j][k] = this.gradients[i][j][k];

					}

					// // IRPROP-
					// if(change > 0) {
					// 	this.updates[i][j][k] = Math.min((this.previousUpdates[i][j][k] * positiveStep), 50);
					// }
					// else if(change < 0) {
					// 	this.updates[i][j][k] = Math.min((this.previousUpdates[i][j][k] * negativeStep), 1e-6);
					// 	this.gradients[i][j][k] = 0;
					// }

					// this.deltas[i][j][k] = (this.sign(this.gradients[i][j][k]) * this.updates[i][j][k]);

				}
			}, this);


		} catch(e) {
			console.log("Error:", e.stack);
		}
	}


});


