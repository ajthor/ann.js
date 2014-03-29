describe("ann", function() {

	var ann;
	
	it("should load without throwing", function() {
		expect(function() {
			ann = require("../ann.js");
		}).not.toThrow();
	});

	it("instantiation should work", function() {

		// var system = require("../lib/training/training.js").backprop;
		// var system = require("../lib/training/training.js").rprop;
		var system = require("../lib/training/training.js").anneal;

		var pattern = require("../lib/network/network.js").boltzmann;

		var a = new ann([4,5], {
			network: pattern,
			trainingSystem: system
		});
		
		console.log(a.run([0,0,0,0]));
		console.log(a.run([1,0,1,0]));
		console.log(a.run([0,1,0,1]));
		console.log(a.run([1,1,1,1]));

		// a.train([[0,0], [0,1], [1,0], [1,1]], [[0], [1], [1], [0]]);

		console.log(a.run([0,0,0,0]));
		console.log(a.run([1,0,1,0]));
		console.log(a.run([0,1,0,1]));
		console.log(a.run([1,1,1,1]));

	});

});