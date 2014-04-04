_ = require("underscore")

network = require("../network")

class boltzmann extends network

	initialize: (@config, options) ->
		super @config, options

		@states = for i in [0...@config.length]
			for j in [0...@config[i]]
				1


	run: (input) ->
		if input? and input.length is @config[0] then input = input[..] 
		else
			throw "Input is not the correct size array." 
			return null

		probs = []
		probs[-1] = input[..]

		if @options.hasBias is on then probs[-1].push 1

		for i in [0...@weights.length]
			
			probs[i] = []

			for j in [0...@weights[i].length]
				
				sum = 0.0

				for k in [0...@weights[i][j].length]
					sum += probs[i-1][k] * @weights[i][j][k]

				probs[i][j] = @activation sum
				
				@states[i+1][j] = ~~(probs[i][j] > Math.random())

		console.log @states
		@visibleProbs = probs

	runVisible: (input) ->
		@run(input)

	runHidden: (input) ->
		if input? and input.length is @config[@config.length-1] then input = input[..]
		else 
			throw "Input is not the correct size array."
			return null

		probs = []
		probs[@config.length-1] = input[..]


		if @options.hasBias is on then probs[@config.length-1].push 1

		for i in [@weights.length-1..0] by -1

			probs[i] = []
			weights = @weights[i].T

			console.log probs, weights

			for j in [0...weights[i].length]

				sum = 0.0

				for k in [0...weights[i][j].length]
					# console.log probs[i+1], @weights[i][j]
					sum += probs[i+1][k] * weights[i][j][k]

				probs[i][j] = @activation sum

				@states[i][j] = ~~(probs[i][j] > Math.random())

		# console.log @states
		@hiddenProbs = probs

module.exports = boltzmann


