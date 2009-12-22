var sc = require("./frameworks/runtime").SC;
var foundation = require("./frameworks/foundation");

// mixin stuff
sc.mixin(sc, foundation);

exports.SC = sc;
exports.SproutCore = sc;
exports.console = sc.console;