ann.js
======

Javascript Artificial Neural Network framework.

Ann.js (_A_rtificial _N_eural _N_etwork) is a Node.js library for creating neural networks. Some architectures which I hope to implement are:
- Feed-forward networks
- Cascade correlation networks
- Restricted Boltzmann Machines (RBMs)

For now, the library has an implementation of feed-forward networks with a working training system based upon simulated annealing. Soon to come, I will update the backprop and iRPROP+ training systems to work with a custom JS matrix library I have created, [matrix](https://github.com/ajthor/matrix).

I am migrating the library away from a pure OO implementation to use the matrix-style mathematics operations. Earlier releases are functional using the OO format, but newer versions should be faster and more versatile.
