# Require underscore.
_ = require("underscore")

class system

	constructor: (@network, options = {}) ->
		# Set options defaults.
		@options = _.defaults(options, {
			# Maximum number of training iterations.
			iterations: 2000,
			# Error threshold is set to 1e-3
			threshold: 1e-3
		})

		this.initialize(@network, @options)

	# initialize
	# ----------
	# Overridable initialize function.
	initialize: (network, options) ->

	# train
	# -----
	# Overridable training function.
	train: ->

# Export system class.
module.exports = system