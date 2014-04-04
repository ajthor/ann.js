coffee = require("coffee-script")

describe("matrix multiplication function", function() {

	it("shoud load ann.js without throwing", function() {
		expect(function() {
			ann = require("../ann");
		}).not.toThrow();
	});

	it("should be defined", function() {
		expect(Array.prototype.mult).toBeDefined();
	});

	it("should exist on new instances of Arrays", function() {
		expect((new Array()).mult).toBeDefined();
		expect([].mult).toBeDefined();
	});

	it("should output the product of 1d arrays", function() {
		arr1 = [0,0,2,3]
		arr2 = [0,1,1,4]
		expect(arr1.mult(arr2)).toEqual( [0,0,2,12] );
	});

	it("should output the product of 2d arrays", function() {
		arr1 = [
			[0,1], 
			[2,3]
		];
		arr2 = [
			[1,1], 
			[2,2]
		];
		expect(arr1.mult(arr2)).toEqual( [
			[0,1], 
			[4,6]
		] );
	});
})