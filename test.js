var sys = require("sys"), posix = require("posix");
var async = false;
if (process.ARGV.indexOf("async") > 0) async = true;

// hack to run tests
var processDirectory = function(path) {
  posix.readdir(path).addCallback(function(list){
    for (var i = 0; i < list.length; i++) {
      var item = path + "/" + list[i];
      if (item.length > 3 && item.substr(item.length - 3) == ".js") {
        // it is a js file
        // read the file
        try {
          var result = sys.exec("node testing/run_test.js " + item).addCallback(function(stdout, stderr) {
            sys.print(stdout + stderr);
          }).addErrback( function(code, stdout, stderr) {
            sys.print("Error: " + code + ": " + stdout + stderr)
          });
          
          if (!async) result.wait();
        } catch (e) {
          // so it failed. Big whoop.
        }
        
      }
      
      posix.stat(item).addCallback(function(path) { return function(stats){
        if (stats.isDirectory()) {
          processDirectory(path);
        }
      } }(item)); 
      
    }
  });
};

processDirectory("tests");