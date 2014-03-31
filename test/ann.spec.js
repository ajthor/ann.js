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
		var system = require("../lib/training/training.js").boltzmann;

		var pattern = require("../lib/network/network.js").boltzmann;

		var a = new ann([6,2], {
			network: pattern,
			trainingSystem: system,
			hasBias: false
		});
		
		console.log(a.run([1,1,1,0,0,0]));
		console.log(a.run([1,0,1,0,0,0]));
		console.log(a.run([1,1,1,0,0,0]));
		console.log(a.run([0,0,1,1,1,0]));
		console.log(a.run([0,0,1,1,0,0]));

		a.train([
			[1,1,1,0,0,0],
			[1,0,1,0,0,0],
			[1,1,1,0,0,0],
			[0,0,1,1,1,0],
			[0,0,1,1,0,0]
		]);
		
		console.log(a.run([1,1,1,0,0,0]));
		console.log(a.run([1,0,1,0,0,0]));
		console.log(a.run([1,1,1,0,0,0]));
		console.log(a.run([0,0,1,1,1,0]));
		console.log(a.run([0,0,1,1,0,0]));

		// console.log("1",a.network.runHidden([0,1]));
		// console.log("2",a.network.runHidden([0,1]));
		// console.log("3",a.network.runHidden([0,1]));
		// console.log("4",a.network.runHidden([0,1]));
		// console.log("5",a.network.runHidden([0,1]));

		// console.log("1",a.network.runHidden([1,0]));
		// console.log("2",a.network.runHidden([1,0]));
		// console.log("3",a.network.runHidden([1,0]));
		// console.log("4",a.network.runHidden([1,0]));
		// console.log("5",a.network.runHidden([1,0]));

		// Training set for XOR problems.
		// a.train([
		// 	[0,0], 
		// 	[0,1], 
		// 	[1,0], 
		// 	[1,1]
		// ], [
		// 	[0], 
		// 	[1], 
		// 	[1], 
		// 	[0]
		// ]);

		// console.log(a.run([0,0,0,0]));
		// console.log(a.run([1,0,1,0]));
		// console.log(a.run([0,1,0,1]));
		// console.log(a.run([1,1,1,1]));

	});

});