var NUM_CORES = 16;


var sys = require("sys"), posix = require("posix");
var async = false;
if (process.ARGV.indexOf("async") > 0) async = true;


var running_count = 0;
var _queue = [];
function queue(what){
  _queue.push(what);
  process_queue();
}

function process_queue() {
  while (running_count < NUM_CORES && _queue.length > 0) _run_first();
}

function _run_first(){
  var entry = _queue.shift();
  running_count ++;
  var result = sys.exec("node testing/run_test.js " + entry).addCallback(function(stdout, stderr) {
    running_count--;
    process_queue();
    sys.print(stdout + stderr);
  }).addErrback( function(code, stdout, stderr) {
    running_count--;
    process_queue();
    sys.print("Error: " + code + ": " + stdout + stderr)
  });
}

// hack to run tests
var processDirectory = function(path) {
  posix.readdir(path).addCallback(function(list){
    for (var i = 0; i < list.length; i++) {
      var item = path + "/" + list[i];
      if (item.length > 3 && item.substr(item.length - 3) == ".js") {
        queue(item);
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