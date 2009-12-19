var sys = require("sys"), posix = require("posix");
/*require.paths.push(process.cwd());

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
*/

// hack to run tests
var processDirectory = function(path) {
  posix.readdir(path).addCallback(function(list){
    for (var i = 0; i < list.length; i++) {
      var item = path + "/" + list[i];
      if (item.length > 3 && item.substr(item.length - 3) == ".js") {
        // it is a js file
        // read the file
        sys.puts("node run_test.js " + item);
/*        sys.exec("node run_test.js " + item).addCallback(function(path) {
          return function(stdout, stderr){ processContents(path, stdout, stderr); };
        }(item));*/
      }
      
      posix.stat(item).addCallback(function(path) { return function(stats){
        if (stats.isDirectory()) {
          processDirectory(path);
        }
      } }(item)); 
      
    }
  });
};

var processContents = function(name, contents) {
//  try {
  //console.error("TEST: " + name);
    console.error("STARTING: " + name);
    console.error(name + " : " + contents);//process.compile(contents, name);
    console.log("Ran: " + result);
//  } catch (e) {
//    sys.error("FAILED: " + name);
//    sys.debug(e);
//    process.exit();
//  }
};



processDirectory("tests");