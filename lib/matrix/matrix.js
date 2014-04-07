// Matrix.js
// =========

// Matrix.js is a costom library developed to address the need for 
// certain matrix math functions in Javascript. This custom class 
// implements several mathematical functions ranging from basic 
// addition and subtraction to some more programmer-oriented 
// functions such as the hadamard (element-wise) product.

// __TODO:__
// - DETERMINANTS
// - INVERSES
// - TRANSFORMATIONS

// Require underscore.
var _ = require("underscore");

// Matrix Class
// ============
// The main class in Matrix.js. Treated as (more or less) a reference 
// data-type from here on out. Defines several properties in the 
// constructor which are unique to each specific instance, and 
// defines some functions which are available to the object alone.
var Matrix = module.exports = function Matrix(dimensions) {
	if(!(this instanceof Matrix)) return new Matrix(dimensions);
	if(typeof dimensions === 'undefined' && dimensions === null) {
		dimensions = [2, 2];
	}

	var row, col;

	// The matrix value object is where all values in the array are 
	// stored. It is a non-enumerable property defined as a 2D array 
	// with dimensions specified at creation. By default, it is 
	// defined as an identity matrix. If you would like to use a 
	// zero-filled matrix, use the `zero()` function.

	// __DEVELOPER'S NOTE:__ Defined here to keep values of different 
	// instances separate.
	Object.defineProperty(this, 'value', {
		value: [],
		configurable: false,
		enumerable: false,
		writable: true
	});

	is2D = Array.isArray(dimensions[0]) ? true : false;

	// Dimensional properties of the matrix, such as how many rows 
	// and columns, and an array containing the row and column info.
	// Row and column information is set at creation and is 
	// determined by the 'dimensions' argument. 
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

	// If the dimensions argument is a 2D array, it is assumed that 
	// it contains an array of values. If it is a 1D array, it is 
	// assumed to be the dimensions of the matrix.

	// Only the first two arrays in a 2D array count. If there are 
	// deeper nested arrays, it won't pick up on that information.
	if(is2D) {
		for(row = 0; row < dimensions.length; row++) {
			this.value[row] = [];
			for(col = 0; col < dimensions[0].length; col++) {
				this.value[row][col] = dimensions[row][col] || 0;
			}
		}
	}
	else {
		this.reset();
	}
};

// Matrix Properties
// -----------------
// Properties of the matrix object, such as the transpose of the 
// matrix and the identity matrix of the same dimensions.
Object.defineProperties(Matrix.prototype, {

	T: {
		get: function() {
			var result = new Matrix([this.cols, this.rows]);
			result.value = _.zip.apply(_, this.value);
			return result;
		},
		enumerable: false
	},

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
	//     A = new Matrix([2,3]);
	//     A.set(1,1)(4);
	//     console.log(A.value); //[ [ 0, 0, 0 ], [ 0, 4, 0 ] ]
	//     console.log(A.get(1,1)); // 4

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
		if(!(M instanceof Matrix)) M = new Matrix(M);
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

	// Zero function accepts optional values as parameters. If a 
	// value is supplied, the matrix will fill itself to that value 
	// rather than defaulting to an identity matrix. This is one way 
	// to zero-out a matrix or fill it with a specific value.
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
// Functions are implemented on the Matrix object, i.e. not part of  
// the prototype object. These functions accept multiple arguments 
// and return a new Matrix object. Arguments can be 
// scalars or Matrices.
_.extend(Matrix, {

	// Addition and Subtraction Functions
	// ----------------------------------
	// Matrix addition and subtraction functions. Matrices can be 
	// added (or subtracted) together provided that they are of the 
	// same dimensions. Matrices can also be modified by 
	// scalar values. E.g. `Matrix.add(3, A, 4);`
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

	// When using the subtraction function, consider the order of 
	// operations, which is from left to right. The interpretation of 
	// the parameters (__A__, __B__, __C__) is the subtraction of 
	// __B__ and __C__ from __A__.

	//     A = new Matrix([3,3]);
	//     B = new Matrix([3,3]);
	//     C = new Matrix([3,3]);
	//     result = Matrix.sub(A, B, C, 3); // result = A - B - C - 3
	sub: function() {
		var i, val;
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

	// Dot Product
	// -----------
	// This is the main matrix multiplication function. It is one of 
	// the only math functions which is fully implemented here rather 
	// than on the prototype because the dot product returns an 
	// entirely new array, which can be of different dimensions than 
	// the original arrays.

	// The `Matrix.dot()` method accepts arrays of different 
	// dimensions, provided that they correspond to the rules of 
	// matrix multiplication. Matrix __A__ must be a *n*x*m* matrix 
	// and matrix __B__ must be a *m*x*p* matrix.

	// The resulting matrix __C__ will be a *n*x*p* matrix.
	dot: function() {
		var i, j, sum, A, B, row, col, result;
		var args = Array.prototype.slice.apply(arguments);

		// [0, 1, 2, 3, 4] l = 5
		for(i = 0; i < args.length-1; i++) {
			if(!result) {
				A = args[i];
			} else {
				A = new Matrix(result.dimensions);
				A.copy(result);
			}
			B = args[i+1];

			if(A.cols !== B.rows) {
				throw "Cannot compute the dot product of matrices of incompatible dimensions. " + A.cols + " !== " + B.rows;
			}
			result = new Matrix([A.rows, B.cols]);
			result.zero();

			for(row = 0; row < A.rows; row++) {
				for(col = 0; col < B.cols; col++) {

					sum = 0;
					for(j = 0; j < A.cols; j++) {
						sum += A.value[row][j] * B.value[j][col];
					}
					result.value[row][col] = sum;

				}
			}
			
		}

		return result;
	},

	product: function() {
		var args = Array.prototype.slice.apply(arguments);

		var result = new Matrix(args[0].dimensions);
		result.copy(args.shift());

		result.product.apply(result, args);

		return result;
	},

	mult: function() {
		var args = Array.prototype.slice.apply(arguments);

		var result = new Matrix(args[0].dimensions);
		result.zero(1);

		result.mult.apply(result, args);

		return result;
	}

});
// Matrix Prototype Math Functions
// -------------------------------
// Functions implemented on the prototype object. These functions do 
// not return a new Matrix object, they modify the object they 
// were called from.

// Another difference between the proto functions and the Matrix 
// object functions is that the proto functions return `this`, 
// allowing for method chaining.
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

	// Dot Product (Proto)
	// -------------------
	// A major difference between the dot product proto 
	// implementation and the Matrix object implementation is that 
	// the proto implementation only accepts matrices of the same, 
	// square dimensions. If this matrix is not square, it will not 
	// be able to use the `dot()` function.
	dot: function() {
		var i, result;
		var args = Array.prototype.slice.apply(arguments);
		for(i = 0; i < args.length; i++) {
			if((this.rows !== this.cols) || !_.isEqual(this.dimensions, args[i].dimensions))
				throw "Must supply matrices of equal dimensions. To multiply rectangular matrices, use the Matrix.dot() function.";
		}

		args.unshift(this);

		result = Matrix.dot.apply(this, args);
		this.copy(result);

		return this;	
	},

	// Product (Scalar and Dot)
	// ------------------------
	// The product function is a combination of the dot product and 
	// scalar multiplication functions. Arguments can be passed in 
	// any order, but the dot product arguments must be of the same 
	// dimensions (see dot product note above).
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
			// Default is dot product.
			else if(args[i] instanceof Matrix) {
				this.dot(args[i]);
			}
		}
		return this;
	},

	// Element-Wise Product (Hadamard)
	// -------------------------------
	// The element-wise product is a product which multiplies 
	// straight across. Element *ij* in matrix __A__ is multiplied by 
	// element *ij* in matrix __B__.
	mult: function() {
		var i, row, col;
		var args = Array.prototype.slice.apply(arguments);
		for(var i = 0; i < args.length; i++) {
			if(typeof args[i] === 'number') {
				val = args[i];
				args[i] = new Matrix(this.dimensions);
				args[i].zero(val);
			}
			else if(!_.isEqual(this.dimensions, args[i].dimensions)) {
				throw "Cannot compute the hadamard (element-wise) product of matrices of different dimensions.";
			}

			for(row = 0; row < this.rows; row++) {
				for(col = 0; col < this.cols; col++) {
					this.value[row][col] *= args[i].value[row][col];
				}
			}
		}
		return this;
	},

	// Power Function
	// --------------
	// Will raise a matrix to a (positive) power. Negative powers and 
	// matrix inverses will come in a later update.
	pow: function(exp) {
		var i;
		var A = new Matrix(this.dimensions);
		A.copy(this);

		if(exp === 0) {
			this.reset();
		} else {
			for(i = 1; i < exp; i++) {
				this.dot(A);
			}
		}

		return this;
	}

});




