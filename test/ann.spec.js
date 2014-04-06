cs = require("coffee-script");

describe("ann", function() {

	var ann;
	
	it("should load without throwing", function() {
		expect(function() {
			ann = require("../lib/pattern/perceptron");
		}).not.toThrow();
	});



	it("instantiation should work", function() {

		// var system = require("../lib/training/system/backprop");


		var a = new ann([2,2,2,1]);

		// var anneal = new system(a);

		// var system = require("../lib/training/training.js").backprop;
		// var system = require("../lib/training/training.js").rprop;

		// var a = new ann([2,2,1], {trainingSystem: system});
		
		console.log(a.run([0,0]));
		console.log(a.run([1,0]));
		console.log(a.run([0,1]));
		console.log(a.run([1,1]));

		// anneal.train(
		// [	[0,0], 
		// 	[0,1], 
		// 	[1,0], 
		// 	[1,1]], 
		// [	[0], 
		// 	[1], 
		// 	[1], 
		// 	[0]]);

		
		console.log(a.run([0,0]));
		console.log(a.run([1,0]));
		console.log(a.run([0,1]));
		console.log(a.run([1,1]));



	});

});