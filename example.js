// an attempt at a more practical test
var sys = require("sys");

var SC = require("./runtime").SC;
process.mixin(GLOBAL, {
  YES: true,
  NO: false
});

var Roots = {
  Root: SC.Object.extend({
    name: "Alex",
    init: function(){
      sys.puts("init root: " + this.name);
    }
  })
};

var r = Roots.Root.create({name: "Hayden"});