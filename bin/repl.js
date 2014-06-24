#!/usr/bin/env node

// Ann.node REPL
// =============
// This is a simplistic REPL which exposes the Ann.node object to 
// the user for debugging and functional testing purposes.
var repl = require('repl');
var ann = require('../build/Release/ann');

console.log('Starting Ann.node REPL...');
console.log('To exit, press <Cmd+D>');

// Start the REPL.
var r = repl.start({
	prompt: '> '
});

// Expose the math and instance objects to the REPL.
r.context.ann = ann;
r.context.i = new ann.Network([2, 2, 1]);
r.context.p = new ann.Perceptron([2, 2, 1]);

// Print a message to the console on exit.
r.on('exit', function () {
	console.log('Exit Ann.node REPL.');
});