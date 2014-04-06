# ann.coffee
# ==========

# Artificial Neural Network library written in JavaScript and 
# CoffeeScript, implementing several neural network architectures,  
# such as multi-layer perceptrons, boltzmann machines, and deep 
# learning networks.

# Require underscore.
_ = require("underscore")

# Array.prototype Extensions
# ==========================
# Some small changes to the array prototype have been made in order to
# facilitate some operations.
Object.defineProperties Array.prototype,
	# Transpose
	# ---------
	# Get the transposed array.
	T: 
		get: ->
			t = Object(this)
			len = t.length >>> 0
			return _.zip.apply(_, (t[i] for i in [0...len]))
	
	# is2D
	# ----
	# `is2D` is a property which returns __true__ or __false__ if any 
	# of the elements in an array is an array.
	is2D: 
		get: ->
			t = Object(this)
			len = t.length >>> 0
			for i in [0...len] by 1
				if t[i] instanceof Array
					return true
			return false

	# dimensions
	# ----------
	# Returns an empty array with this array's dimensions. Useful for 
	# ensuring that the index you wish to set to will always 
	# be available.
	dimensions:
		get: ->
			t = Object(this)
			len = t.length >>> 0
			result = []
			for i in [0...len] by 1
				if t[i] instanceof Array
					result[i] = t[i].dimensions
			return result

# sum
# ---
# `sum` returns the sum of a 1-dimensional array.
Array::sum = ->
	t = Object(this)
	len = t.length >>> 0
	sum = 0.0
	for i in [0...len] by 1
		sum += t[i]
	return sum

# map
# ---
# `map` is an implementation of the EMCA polyfill for `map` with one 
# exception---it iterates over 2d-arrays.
Array::map = (f, args...) ->
	t = Object(this)
	len = t.length >>> 0

	if typeof f isnt "function"
		throw new TypeError()

	result = []
	thisArg = if arguments.length >= 2 then arguments[1] else undefined
	for i in [0...len] by 1
		if t[i] instanceof Array
			result[i] = t[i].map f, args...
		else
			result[i] ?= f.call thisArg, t[i], i, t

# Basic Array Math Functions
# --------------------------
# - `add` adds two arrays together.
# - `subtract` subtracts an array from another.
# - `multiply` multiplies two arrays together. 
# - `divide` divides an array by another. 

# Array math functions work on arrays fo the same dimensions (meaning
# it will work with complex, nested arrays or multi-dimensional 
# matrices, but will run on arrays of different dimensions. Cannot 
# guarantee that the results will be as expected when using arrays of 
# different dimensions.
Array::add = (arr) ->
	t = Object(this)
	len = t.length >>> 0
	result = []
	for i in [0...len] by 1
		if t[i] instanceof Array
			result[i] = t[i].add(arr[i])
		else 
			result[i] ?= t[i] + arr[i]
	return result

Array::subtract = (arr) ->
	t = Object(this)
	len = t.length >>> 0
	result = []
	for i in [0...len] by 1
		if t[i] instanceof Array
			result[i] = t[i].subtract(arr[i])
		else 
			result[i] ?= t[i] - arr[i]
	return result

Array::multiply = (arr) ->
	t = Object(this)
	len = t.length >>> 0
	result = []
	for i in [0...len] by 1
		if t[i] instanceof Array
			result[i] = t[i].multiply(arr[i])
		else
			result[i] ?= t[i] * arr[i]
	return result
	
Array::divide = (arr) ->
	t = Object(this)
	len = t.length >>> 0
	result = []
	for i in [0...len] by 1
		if t[i] instanceof Array
			result[i] = t[i].divide(arr[i])
		else
			result[i] ?= t[i] / arr[i]
	return result

# reset
# -----
# Resets all values of an array to the provided value or 0 
# if undefined.
Array::reset = (value) ->
	t = Object(this)
	len = t.length >>> 0

	if value? then value = 0

	result = Array.apply(null, new Array(len)).map(Number.prototype.valueOf, value)
	for i in [0...len] by 1
		if t[i] instanceof Array
			result[i] = t[i].reset(value)

	return result

# clone
# -----
# Clones a multi-dimensional array.
Array::clone = ->
	t = Object(this)
	len = t.length >>> 0
	result = t[..]
	for i in [0...len] by 1
		if t[i] instanceof Array
			result[i] = t[i].clone()

	return result



# Network Class
# =============
# The meat and potatoes of the ann.js library. This is the base class 
# for many of the implementations and architectures seen in this 
# library.
class network

	constructor: (@config = [2,2], options = {}) ->
		@weights = []

		# Set default options.
		@options = _.defaults(options, {
			# Sigmoid activation & derivative function.
			activation: (x) -> ( 1 / (1 + Math.exp(-x)) )
			derivative: () -> (this.output * (1 - this.output))
			hasBias: true
		})

		@activation ?= options.activation
		@derivative ?= options.derivative

		this.initialize(@config, @options)

	# initialize
	# ----------
	# Overridable initialize function.
	initialize: (config, options) ->

		# console.log "Setting up weights with config: #{@config}"
		# Populate weights array with random values.
		for i in [0...config.length]

			@weights[i] = []

			# # In each layer, `i`, the weights array is a matrix of 
			# # dimensions i x i+1.
			for j in [0...config[i+1]]

				@weights[i][j] = [] 

				for k in [0...config[i]]
					@weights[i][j][k] = Math.random()

				if @options.hasBias is on and i < config.length-1
						@weights[i][j].push 1

	# run
	# ---
	# Overridable function specified in each particular architecture.
	run: (input) ->

	# forEach
	# -------
	# Made to be similar to the implementation of `_.each` in
	# [underscore.js](http://www.underscorejs.org)

	# Passes the weights associated with each neuron and the row and 
	# column indices.
	forEach: (cb, handler) ->
		if cb? is false then return null
		handler ?= this

		for i in [0...@weights.length]
			for j in [0...@weights[i].length]
				cb.call(handler, @weights[i][j], i, j)

	# clone
	# -----
	# Clones the current network and copies the weights values from  
	# the current network to the cloned network.
	clone: ->
		clone = new this.constructor(this.config, this.options)
		clone.copy this

		return clone
	# copy
	# ----
	# Copies the weights values from `network`.
	copy: (network) ->
		@weights = []
		for i in [0...network.weights.length]
			@weights[i] = []
			for j in [0...network.weights[i].length]
				@weights[i][j] = network.weights[i][j][..]


# Export the `network` class.
module.exports = network


