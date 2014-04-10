# Require undrscore.
_ = require("underscore")
chalk = require("chalk")
# Imports system class
system = require("../system")
	

# Backpropagation
# ===============
# Backpropagation is a process used to train artificial neural 
# networks by using a method known as "gradient descent". The 
# implementation requires knowledge of the ideal outputs of a system 
# in order to train the system.

# __NOTE:__ Changing the activation function in the network class 
# also requires that you update the derivative function to match the
# activation function that you use. Default is *sigmoid* activation.

# __NOTE:__ This backpropagation method runs in batch training mode
# rather than on-line training mode, even though some papers have
# commented that batch is less effective than on-line training using
# random indices. The reason for this is that the RPROP training 
# function requires batch mode, and it is easier to visualize the two
# if they are using the same training mechanism.

# Depends on the following methods in the network class:
# - `calculateError`
class backprop extends system

	train: (inputs, ideals) ->

		i = 0
		error = 1

		@previousError = @network.output.dimensions
		@error = @network.output.dimensions
		@error.reset(0)

		@deltas = @network.outputs.dimensions
		@neuronDeltas = @network.weights.dimensions
		@gradients = @network.weights.dimensions

		@previousDeltas = []
		@previousGradients = []

		console.log chalk.red("Training started.")
		console.time "Training took"

		# Cycle through inputs and ideal values to train network
		# and avoid the problem of 'catastrophic forgetting'.

		while error > @options.threshold and i < @options.iterations
			i += 1

			sum = 0

			@previousGradients = @gradients.clone()
			@previousDeltas = @deltas.clone()

			@gradients.reset(0)
			@deltas.reset(0)

			# Calculate random index.
			# index = Math.floor(i * Math.random()) % inputs.length

			# Begin training epoch.
			for index in [0...inputs.length]
				@network.run(inputs[index])

				this.calculateNeuronDeltas(ideals[index])
				this.calculateGradients(inputs[index])

				sum += @network.calculateError(ideals[index])



			this.calculateDeltas()

			this.updateWeights()

			error = sum / inputs.length

		# End training.
		console.log chalk.yellow("Training finished in #{ i } iterations.")
		console.log chalk.yellow("Error is at: #{ error }")
		console.timeEnd "Training took"

	calculateDeltas: ->
		@network.forEach ((weights, i, j) ->
			for k in [0...weights.length] by 1
				@deltas[i][j][k] = @options.learningRate * @gradients[i][j][k]
				@deltas[i][j][k] += @options.momentum * @previousDeltas[i][j][k]

		), this

	updateWeights: ->
		@network.weights = @network.weights.add(@deltas)

	# calculateNeuronDeltas
	# ---------------------
	# Individual neuron delta values are calculated by moving 
	# backwards through the network and calculating the error for 
	# each individual neuron.
	calculateNeuronDeltas: (ideals) ->
		for i in [@network.output.length-1..0] by -1

			for j in [0...@network.output[i]] by 1

				error = 0.0
				# If this is the last layer, the error is the 
				# difference between the ideal and the actual output 
				# values of the last neuron.
				if @network.config[i+1]?

					error = ideals[j] - @network.output[i][j]

				# Otherwise, the error is the sum of the weights 
				# multiplied by the corresponding neuron's 
				# delta value.
				else
					# The index of this neuron is j, therefore, the 
					# corresponding weights will also be at j.

					for k in [0...@network.output[i+1]]
						error += @network.weights[i+1][k][j] * @deltas[i+1][k]

				@previousError[i][j] = @error[i][j]
				@error[i][j] = error

				@neuronDeltas[i][j] = @network.derivative * error

	calculateGradients: (inputs) ->
		@network.forEach ((weights, i, j) ->
			for k in [0...@gradients.length] by 1
				@gradients[i][j][k] += @neuronDeltas[i][j] * (if i > 0 then @network.output[i-1][k] else inputs[k])
		), this

module.exports = backprop


