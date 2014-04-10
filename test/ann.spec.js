describe("ann", function() {

	var ann;
	
	it("should load without throwing", function() {
		expect(function() {
			ann = require("../lib/pattern/perceptron.js");
		}).not.toThrow();
	});



	it("instantiation should work", function() {

		var system = require("../lib/training/system/anneal.js");


		var a = new ann([2,2,3,1]);

		var anneal = new system(a);

		// var system = require("../lib/training/training.js").backprop;
		// var system = require("../lib/training/training.js").rprop;

		// var a = new ann([2,2,1], {trainingSystem: system});
		
		console.log(a.run([0,0]).value);
		console.log(a.run([1,0]).value);
		console.log(a.run([0,1]).value);
		console.log(a.run([1,1]).value);

		anneal.train(
		[	[0,0], 
			[0,1], 
			[1,0], 
			[1,1]], 
		[	[0], 
			[1], 
			[1], 
			[0]]);

		
		console.log(a.run([0,0]).value);
		console.log(a.run([1,0]).value);
		console.log(a.run([0,1]).value);
		console.log(a.run([1,1]).value);



	});

});