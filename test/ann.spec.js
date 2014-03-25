describe("ann", function() {

	var ann;
	
	it("should load without throwing", function() {
		expect(function() {
			ann = require("../ann.js");
		}).not.toThrow();
	});

	it("instantiation should work", function() {
		// var system = require("../util/training/training.js").backprop;
		var system = require("../util/training/training.js").rprop;
		var a = new ann([2,3,1], {trainingSystem: system});
		var output;

		console.log(a.parse([0,0]));
		console.log(a.parse([1,0]));
		console.log(a.parse([0,1]));
		console.log(a.parse([1,1]));

		a.train([[0,0], [0,1], [1,0], [1,1]], [[0], [1], [1], [0]]);
		// a.train([[0,1]], [[1]]);
		// a.train([[1,0]], [[1]]);

		// console.log(a.input([0,0]));
		// console.log(a.input([1,0]));
		// console.log(a.input([0,1]));
		// console.log(a.input([1,1]));
		
		// a.train([[0,0]], [[0]]);

		console.log(a.parse([0,0]));
		console.log(a.parse([1,0]));
		console.log(a.parse([0,1]));
		console.log(a.parse([1,1]));


	});

});