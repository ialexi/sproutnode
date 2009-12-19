What is this?
=============
This is a temporary hacked-together SproutCore runtime that can run on the server.

A proper version would keep each piece in its own CommonJS module; this just creates
a single CommonJS module for the entire thing.

It is one file: runtime.js

I will be cleaning it up a bit (putting all test-related files in a folder specifically
for that, etc.)

What are all the other files?
-----------------------------
The other files are the tests and test-related. You can run tests with:

	bash run_tests.sh

run_tests.sh was created by running:

	node generate_tests.js > run_tests.sh

All it does is repeatedly run "run_test.js" for each test.

Most of the work has gone into making the tests run (rather than actually
making "runtime" work). The test runner is a bit hacky, but it does run
tests (and the vast majority pass!)

By default, it only shows the tests that have errors. To show all tests,
comment the following line in run_test.js:

		console.log = function() {  };

