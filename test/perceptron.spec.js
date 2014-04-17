describe("perceptron", function() {

	var ann;

	var instance;
	var trainer;
	
	it("should load without throwing", function() {
		expect(function() {
			ann = require("../lib/pattern/perceptron.js");
		}).not.toThrow();
	});

	it("instantiation should work", function() {
		
		var system = require("../lib/training/system/anneal.js");

		instance = new ann([2,2,3,1]);
		trainer = new system(instance);
	});

	it("should run values", function() {
		console.log(instance.run([0,0]).value);
		console.log(instance.run([1,0]).value);
		console.log(instance.run([0,1]).value);
		console.log(instance.run([1,1]).value);
	});

	it("should train", function() {

		trainer.train(
		[	[0,0], 
			[0,1], 
			[1,0], 
			[1,1]], 
		[	[0], 
			[1], 
			[1], 
			[0]]);


		console.log(instance.run([0,0]).value);
		console.log(instance.run([1,0]).value);
		console.log(instance.run([0,1]).value);
		console.log(instance.run([1,1]).value);



	});

});