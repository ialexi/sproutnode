What is this?
=============
This is a temporary hacked-together SproutCore runtime that can run on the server.

A proper version would keep each piece in its own CommonJS module; this just creates
a single CommonJS module for the entire thing.

It is one file: runtime.js

There are very few modifications. The changes make it export SproutCore (SC) and change
all occurrences of "window" that refer to the global scope in browsers to "GLOBAL".
It also exports a "global" object that can be mixed in to GLOBAL if you so choose (it
makes things simpler);

Testing
=======
All tests should pass. They are all in their original form, except for two things:
"window" replaced with "GLOBAL", and, in one test, an equals(object[0], GLOBAL) replaced
with ok(object[0] === GLOBAL), because apparently (for some strange reason) the function
dump does not play nicely with the GLOBAL object.

To run the tests, run:

		$ node test.js
	
It should just list all of the tests, with two exceptions: 

- A few tests test using the console, so they will write out things like: "ERROR: Console.error is working".
- The test for cookie is commented out; as such, it has no test plan, so for it, ERROR: "NO PLAN!!!" will be shown.
  The test is commented out, obviously, because it does not apply on the server.

You might note that you don't see: LOG: "Console.log is working"

This is because console.log is disabled by default (see "console.log" section).

What's really nice: **the tests are asynchronous. If you have eight cores (or sixteen virtual cores) it will run eight (or sixteen) times as fast.**

console.log
-----------
console.log is disabled in the tests by default to keep passing tests from writing out all the
information (which would quickly take over your console). If you wish to show it, edit the file
testing/run_test.js, and comment the line:

		console.log = function() {  };
