var sys = require("sys");

exports.message = function(type, what) {
	sys.puts(type + ": " + sys.inspect(what));
};

exports.log = function(what){
	exports.message("LOG", what);
};

exports.info = function(what){
	exports.message("INFO", what);
};

exports.error = function(what){
	exports.message("ERROR", what);
};

exports.warn = function(what){
	exports.message("WARN", what);
};

