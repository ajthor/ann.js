# Require underscore.
_ = require("underscore")
chalk = require("chalk")

# Imports system class.
system = require("../system")

# Simulated Annealing
# ===================
# This training system uses a process known as "simulated annealing"
# in order to train a feed-forward neural network. This may or may not
# work on other types of networks, but this implementation is
# specifically designed for the feed-forward variety. Depends on some
# methods in the network class:
# - `clone`
# - `copy`
# - `run`
# - `calculateError` (may not exist in every architecture)
class anneal extends system

	train: (inputs, ideals) ->

		i = 0
		
		neighbor = null
		network = @network.clone()
		best = @network.clone()

		T = @options.initialTemperature or 10

		console.log chalk.red("Training started.")
		console.time "Training took"

		error = 1.0
		ebest = 1.0
		# Train until error is less than threshold OR T reaches 0;
		while error > @options.threshold and T > 0
			i += 1

			E = error

			sum = 0

			# Anneal the weights by cycling through the weights
			# and applying the annealing algorithm to them.

			neighbor = best.clone()
			# __NOTE:__ Not sure if this is technically the correct 
			# annealing algorithm. I decided to set the starting 
			# network to the *best* network. I did this because by 
			# setting it to the current network, the algorithm failed 
			# to converge about 99% of the time. After the change, the 
			# algorithm converges 99% of the time with current 
			# temperature values.

			# First, randomize the weights.
			neighbor = this.randomize(neighbor, T)

			# Then, calculate the total error.
			for j in [0...inputs.length]

				neighbor.run inputs[j]

				sum += neighbor.calculateError ideals[j]

			error = sum / inputs.length

			# If the new error is less than the old error, then the
			# new solution is better.
			if error < E
				# Accept the new solution.
				network.copy neighbor

				# Check if new solution is the best solution.
				if error < ebest

					ebest = error
					best.copy neighbor

					console.log "Error: #{ ebest }"
			# If it's not necessarily better, check if it's possible
			# to jump to this less-than-ideal solution.
			else
				P = Math.exp((E - error) / T)

				if P > Math.random()

					network.copy neighbor

			T -= 1e-5

			# if (i % 1000) is 0 then console.log "Error is at: #{ ebest }"

		# End training.
		@network.copy best

		console.log chalk.yellow("Training finished in #{ i } iterations.")
		console.log chalk.yellow("Error is at: #{ error }")
		console.timeEnd "Training took"

	# randomize
	# ---------
	# Function to randomize the weights of a network.
	randomize: (network, T) ->

		network.forEach (weights, i, j) ->
			for k in [0...weights.length]

				delta = 0.5 - Math.random()
				delta /= 10
				delta *= T

				network.weights[i][j][k] += delta

		return network


module.exports = anneal