# Require underscore.
_ = require("underscore")

# Multi-Layer Perceptron Class
# ============================
# Extends `network` class. 

# Implementation of a multi-layer, feed-forward perceptron network. 

network = require("../network")

class perceptron extends network

	# `perceptron` class works by taking the input, pushing it to the 
	# output array and passing the output array forward to be 
	# multiplied by the weights of the following layer's neurons.
	run: (input) ->
		if input? and input.length is @config[0] then input = input[..] 
		else
			throw "Input is not the correct size array." 
			return null

		output = []
		output[-1] = input[..]

		# Account for bias.
		if @options.hasBias is on then output[-1].push 1

		for i in [0...@weights.length-1]
			
			output[i] = for j in [0...@weights[i].length]

				product = output[i-1].multiply(@weights[i][j])
				sum = product.sum()
				
				@activation sum


		@output = output


		return output[output.length-1]

	calculateError: (ideal) ->
		error = 0.0
		last = @output[@output.length-1]

		for i in [0...last.length]
			error += Math.pow (ideal[i] - last[i]), 2

		return error

# Export the `perceptron` class.
module.exports = perceptron


