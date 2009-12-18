var sys = require("sys"), posix = require("posix");
require.paths.push(process.cwd());

process.mixin(GLOBAL, require("runtime").global);

// a hacky simulation of the SproutCore test engine.
var CoreTest = {
  SC: SC,
  reportInfo: NO,
  
  _wroteHeader: NO,
  _currentName: "",
  
  _wroteModuleHeader: NO,
  _currentModuleName: "",
  
  _wroteTestHeader: NO,
  _currentTestName: "",
  start: function(what) {
    CoreTest._currentName = what;
    CoreTest._wroteHeader = NO;
    CoreTest._wroteModuleHeader = NO;
    CoreTest._wroteTestHeader = NO;
  },
  
  log: function(what) {
    if (CoreTest.reportInfo) console.log(what);
  },
  
  error: function(what) {
    if (!CoreTest._wroteHeader) sys.puts("FOR: " + CoreTest._currentName);
    if (!CoreTest._wroteModuleHeader) sys.puts("module: " + CoreTest._currentModuleName);
    if (!CoreTest._wroteTestHeader) sys.puts("test: " + CoreTest._currentTestName);
    CoreTest._wroteTestHeader = CoreTest._wroteHeader = CoreTest._wroteModuleHeader = YES;
    console.error(what);
  },
  
  // test environment
  module: function(name, stuff){
    CoreTest._wroteModuleHeader = NO;
    CoreTest._currentModuleName = name;
    CoreTest.log("Testing: " + name);
    
    stuff = stuff || {};
    this._current_setup = stuff.setup;
  },

  test: function(name, func) {
    if (this._current_setup) this._current_setup();
    CoreTest._wroteTestHeader = NO;
    CoreTest._currentTestName = name;
    CoreTest.log("Test: " + name);
    func();
  },
  
  equals: function(actual, expected, text){
    CoreTest.push(expected==actual, actual, expected, text);
  },
  
  ok: function(expression, text) {
    if (ok) CoreTest.log("PASSED: " + text);
    else CoreTest.error("FAILED: " + text);
  },
  
  equiv: require("./utils").equiv,
  
  same: function(a, b, message) {
    CoreTest.push(equiv(a, b), a, b, message);
  },
  
  push: function(result, actual, expected, message) {
    message = message || (result ? "okay" : "failed");
    (result ? CoreTest.log : CoreTest.error)(message + ": " + result + "; actual: " + actual + "; expected: " + expected)
  }
};
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