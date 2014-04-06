_ = require("underscore")

# Matrix.js
# =========

class Matrix

	constructor: (dimensions = [2, 2]) ->
		@rows = dimensions.length
		@columns = if dimensions.is2D then dimensions[0].length else dimensions[0]

		this.reset()

	Object.defineProperties @prototype,
		dimensions:
			get: ->
				return [@rows, @columns]

		T:
			get: ->
				t = Object(this.values)
				len = t.length >>> 0
				return _.zip.apply(_, (t[i] for i in [0...len]))

	set: (x, y) ->
		`return function(value) {this.values[x][y] = value;};`
	get: (x, y) ->
		return @values[x][y]

	reset: ->
		@values = []
		for i in [0...@rows] by 1
			@values[i] = []
			for j in [0...@columns] by 1
				@values[i][j] = 0


x = new Matrix([1,2])
console.log x, x.T
y = new Matrix([2,1])
console.log y, y.T
x.set(0,1)(4)

module.exports = Matrix


