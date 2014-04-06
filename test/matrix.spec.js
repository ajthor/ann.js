cs = require("coffee-script");

describe("matrix", function() {

	var matrix;
	
	it("should load without throwing", function() {
		expect(function() {
			matrix = require("../lib/matrix.js");
		}).not.toThrow();
	});



	it("instantiation should work", function() {

		_m = new matrix([2,2])

	});

});