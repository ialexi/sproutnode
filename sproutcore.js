var sc = require("./frameworks/runtime").SC;
var foundation = require("./frameworks/foundation");

// you have to mix in SC last...
sc.mixin(exports, sc);
sc.mixin(exports, foundation);