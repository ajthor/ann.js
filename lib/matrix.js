
var _ = require("underscore");

// Matrix.js
// =========

// Matrix.js is a costom library developed to address the need for 
// certain matrix math functions in Javascript. This custom class 
// implements several mathematical functions ranging from basic 
// addition and subtraction to some more programmer-oriented 
// functions such as the hadamard (element-wise) product.

// Matrix Class
// ============
// The main class in Matrix.js. Treated as (more or less) a referende 
// data-type from here on out. Defines several properties in the 
// constructor which are unique to each specific instance, and 
// defines some functions which are available to the object alone.
var Matrix = module.exports = function Matrix(dimensions) {
	if(!(this instanceof Matrix)) return new Matrix(dimensions);
	if(typeof dimensions === 'undefined' && dimensions === null) {
		dimensions = [2, 2];
	}

	// The matrix value object is where all values in the array are 
	// stored. It is a non-enumerable property defined as a 2D array 
	// with dimensions specified at creation. By default, it is 
	// defined as an identity matrix.

	// __DEVELOPER'S NOTE:__ Defined here to keep values of different 
	// instances separate.
	Object.defineProperty(this, 'value', {
		value: [],
		configurable: false,
		enumerable: false,
		writable: true
	});

	is2D = Array.isArray(dimensions[0]) ? true : false;

	Object.defineProperties(this, {
		rows: {
			value: is2D ? dimensions.length : dimensions[0],
			writable: false
		},
		cols: {
			value: is2D ? dimensions[0].length : dimensions[1],
			writable: false
		},
		dimensions: {
			get: function() {
				return [this.rows, this.cols];
			},
			enumerable: false
		}
	});

	this.reset();
};

Object.defineProperties(Matrix.prototype, {
	// Returns the transpose of the matrix.
	T: {
		get: function() {
			var t = Object(this.value);
			return _.zip.apply(_, t);
		},
		enumerable: false
	},
	// Returns the identity matrix.
	I: {
		get: function() {
			return new Matrix(this.dimensions).value;
		},
		enumerable: false
	}
});

_.extend(Matrix.prototype, {
	// Custom Getter and Setter Functions
	// ----------------------------------
	// These functions are custom getter and setter methods for the 
	// `value` property defined on the Matrix object above. These 
	// allow for a more intuitive (I think) way to access and set the 
	// values of the matrix.

	// Example usage:
	// 
	//     x = new Matrix([2,3]);
	//     x.set(1,1)(4);
	//     console.log(x.value); //[ [ 0, 0, 0 ], [ 0, 4, 0 ] ]
	//     console.log(x.get(1,1)); // 4

	get: function(x, y) {
		return this.value[x][y];
	},

	set: function(x, y) {
		return (function(_value) {
			this.value[x][y] = _value;
		}).bind(this);
	},

	valueOf: function() {
		return this.value;
	},

	copy: function(M) {
		for(row = 0; row < M.rows; row++) {
			for(col = 0; col < M.cols; col++) {
				this.value[row][col] = M.value[row][col];
			}
		}
	},

	reset: function(value) {
		this.zero();
		for(i = 0; i < this.dimensions[0]; i++) {
			this.set(i, i)(1);
		}
	},

	zero: function(value) {
		value || (value = 0);
		var row, col;
		for(row = 0; row < this.rows; row++) {
			this.value[row] = [];

			for(col = 0; col < this.cols; col++) {
				this.value[row][col] = value;
			}
		}
	}
});

// Matrix Math Functions
// =====================
// Functions implemented on the Matrix object, i.e. not part of the 
// prototype object. These functions accept multiple values and 
// return a new Matrix object. Arguments can be scalars or Matrices.
_.extend(Matrix, {

	add: function() {
		var i, row, col;
		var args = Array.prototype.slice.apply(arguments);
		var first;
		for(i = 0; i < args.length && !first; i++) {
			if(args[i] instanceof Matrix) first = args[i];
		}

		var result = new Matrix(first.dimensions);
		result.zero();

		result.add.apply(result, args);

		return result;
	},

	sub: function() {
		var i, row, col, val;
		var args = Array.prototype.slice.apply(arguments);
		var first;
		for(i = 0; i < args.length && !first; i++) {
			if(args[i] instanceof Matrix) first = args[i];
		}

		var result = new Matrix(first.dimensions);
		if(typeof args[0] === 'number') {
			val = args[0];
			args[0] = new Matrix(first.dimensions);
			args[0].zero(val);
		}
		result.copy(args.shift());

		result.sub.apply(result, args);

		return result;
	},

	product: function() {
		var i, row, col;
		var args = Array.prototype.slice.apply(arguments);

		var result = new Matrix(args[0].dimensions);
		result.copy(args.shift());

		result.product.apply(result, args);

		return result;
	},

	elproduct: function() {
		var i, row, col;
		var args = Array.prototype.slice.apply(arguments);

		var result = new Matrix(args[0].dimensions);
		result.zero(1);

		result.elproduct.apply(result, args);

		return result;
	}

});
// Functions implemented on the prototype object. These functions do 
// not return a new Matrix object, they modify the object they 
// were called from.
_.extend(Matrix.prototype, {

	add: function() {
		var i, row, col, val;
		var args = Array.prototype.slice.apply(arguments);
		for(i = 0; i < args.length; i++) {
			if(typeof args[i] === 'number') {
				val = args[i];
				args[i] = new Matrix(this.dimensions);
				args[i].zero(val);
			}
			else if(!_.isEqual(this.dimensions, args[i].dimensions)) {
				throw "Cannot add matrices of different dimensions.";
			}

			for(row = 0; row < this.rows; row++) {
				for(col = 0; col < this.cols; col++) {
					this.value[row][col] += args[i].value[row][col];
				}
			}
		}
		return this;
	},
	sub: function() {
		var i, row, col, val;
		var args = Array.prototype.slice.apply(arguments);
		for(i = 0; i < args.length; i++) {
			if(typeof args[i] === 'number') {
				val = args[i];
				args[i] = new Matrix(this.dimensions);
				args[i].zero(val);
			}
			else if(!_.isEqual(this.dimensions, args[i].dimensions)) {
				throw "Cannot subtract matrices of different dimensions.";
			}

			for(row = 0; row < this.rows; row++) {
				for(col = 0; col < this.cols; col++) {
					this.value[row][col] -= args[i].value[row][col];
				}
			}
		}
		return this;
	},

	product: function() {
		var i, row, col;
		var args = Array.prototype.slice.apply(arguments);
		for(var i = 0; i < args.length; i++) {

			// Scalar multiplication.
			if(typeof args[i] === 'number') {
				for(row = 0; row < this.rows; row++) {
					for(col = 0; col < this.cols; col++) {
						this.value[row][col] *= args[i];
					}
				}
			}
			// Default is cross product.
			else if(args[i] instanceof Matrix) {
				console.log("Matrix");
			}
		}
		return this;
	},

	elproduct: function() {
		var i, row, col;
		var args = Array.prototype.slice.apply(arguments);
		for(var i = 0; i < args.length; i++) {
			if(!_.isEqual(this.dimensions, args[i].dimensions)) {
				throw "Cannot compute the hadamard (element-wise) product of matrices of different dimensions.";
			}

			for(row = 0; row < this.rows; row++) {
				for(col = 0; col < this.cols; col++) {
					this.value[row][col] *= args[i].value[row][col];
				}
			}
		}
		return this;
	}

});

x = new Matrix([3,3]);

y = new Matrix([3,3]);
y.set(1,0)(2);

z = new Matrix([3,3]);
z.set(1,0)(2);
z.set(2,0)(5);

var ans = Matrix.add(x, y, z);
ans.product(1.5);
console.log(ans.value);
ans = Matrix.sub(ans, 5);
console.log(ans.value);

z.product(4, 8, z);

console.log(z.value);




