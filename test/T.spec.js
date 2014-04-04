coffee = require("coffee-script");

describe("Array.prototype.T", function() {

	var ann;
	
	it("should load ann.js without throwing", function() {
		expect(function() {
			ann = require("../ann");
		}).not.toThrow();
	});

	it("should be defined", function() {
		expect(Array.prototype.T).toBeDefined();
	});

	it("should exist on new instances of Arrays", function() {
		expect((new Array()).T).toBeDefined();
		expect([].T).toBeDefined();
	});

	it("should transpose arrays", function() {
		var arr = [[1,1], [2,2]];
		expect( arr.T ).toEqual( [[1,2], [1,2]] );
	});

	it("should not break with arrays of different sizes", function() {
		expect(function() {
			[[1,1], [2]].T;
		}).not.toThrow();
	});
});