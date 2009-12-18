What is this?
=============
This is a temporary hacked-together SproutCore runtime that can run on the server.

A proper version would keep each piece in its own CommonJS module; this just creates
a single CommonJS module for the entire thing.

It is one file: runtime.js

What are all the other files?
-----------------------------
The other files are the tests and test-related. You can run tests with:
node test.js

Most of the work has gone into making the tests run (rather than actually
making "runtime" work). The test runner is a bit hacky, but it does run
tests (and the vast majority pass!)

By default, it only shows the tests that have errors. To show all tests,
comment the following line in test.js:

		console.log = function() {  };

What doesn't work?
------------------
Whether it is an issue with the test or something else, a few SparseArray 
tests don't seem to want to pass. I will be looking into this, obviously.