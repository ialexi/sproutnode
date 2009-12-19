var sys = require("sys"), posix=require("posix");
var argv = process.ARGV;

sys.puts(argv[2]);

/* Prepare Tester */
// mix in globals
process.mixin(GLOBAL, require("./runtime").global);

// turn of .log (comment to get ALL test results)
console.log = function() {  };

// some basic functions (the definition of CoreTest, etc.)
var Testing = require("./coretest").Testing;
process.mixin(GLOBAL, Testing);

// load array test suites
SC.ArraySuite = require("./manual_array_suites").ArraySuite;

// run code
posix.cat(argv[2]).addCallback(function(contents){
  process.compile(contents, argv[2]);
}).wait();

CoreTest.Runner.begin();