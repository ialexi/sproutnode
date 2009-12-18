var sys = require("sys"), posix = require("posix");
require.paths.push(process.cwd());

process.mixin(GLOBAL, require("runtime").global);

// a hacky simulation of the SproutCore test engine.
var CoreTest = require("./coretest");
process.mixin(GLOBAL, CoreTest);

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
  try {
    CoreTest.start(name);
    var result = process.compile(contents, name);
    CoreTest.log("Ran: " + result);
  } catch (e) {
    sys.error("FAILED: " + name);
    sys.debug(e);
    process.exit();
  }
};



processDirectory("tests");