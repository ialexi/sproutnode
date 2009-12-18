var sys = require("sys"), posix = require("posix");
require.paths.push(process.cwd());

process.mixin(GLOBAL, require("runtime").global);

// turn of .log (comment to get ALL test results)
console.log = function() {  };

// a hacky simulation of the SproutCore test engine.
var Testing = require("./coretest").Testing;
Testing._module = Testing.module;
process.mixin(GLOBAL, Testing);
Testing.CoreTest.Suite = require("./suite").Suite;


// load array test suites
SC.ArraySuite = require("manual_array_suites").ArraySuite;


// hack to run tests
var processDirectory = function(path) {
  posix.readdir(path).addCallback(function(list){
    for (var i = 0; i < list.length; i++) {
      var item = path + "/" + list[i];
      if (item.length > 3 && item.substr(item.length - 3) == ".js") {
        // it is a js file
        // read the file
        posix.cat(item).addCallback(function (name) { 
          return function(contents) { processContents(name, contents); };
        }(item) );
      }
      
      posix.stat(item).addCallback(function(stats){
        if (stats.isDirectory()) {
          processDirectory(item);
        }
      }); 
      
    }
  });
};

var processContents = function(name, contents) {
//  try {
    Testing.start(name);
    var result = process.compile(contents, name);
    Testing.log("Ran: " + result);
//  } catch (e) {
//    sys.error("FAILED: " + name);
//    sys.debug(e);
//    process.exit();
//  }
};



processDirectory("tests");