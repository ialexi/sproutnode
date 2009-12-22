// an attempt at a more practical test
var sys = require("sys"), http = require("http");

var SC = require("./index").SC;

// bonus stuff:
process.mixin(GLOBAL, {
  YES: true,
  NO: false
});

exports.myObject = SC.Object.create({
  saying: "Hello, World!"
});

exports.controller = SC.ObjectController.create({
  content: exports.myObject
});

SC.root = exports;

// this is pretty pathetic, but still, it is an example
// no message queuing means it would never work, though :)
var Server = SC.Object.extend({
  value: "Hi",
  waiters: [],
  request: function(request, response){
    var rl = SC.RunLoop.begin();
    if (request.uri.path == "/change") {
      exports.myObject.set("saying", request.uri.params["to"]); // purposefully tell Object and not Controller.
      response.sendHeader(200, {"content-type": "text/plain"});
      response.sendBody("Done!");
      response.finish();
    } else {
      this.waiters.push(response);
      var self=this;
      setTimeout(function(){ 
        var rl = SC.RunLoop.begin();
        self.finish(response);
        rl.end();
      }, 5000); // do it automatically after 30 seconds.
    }
    rl.end();
  },
  
  valueDidChange: function() {
    for (var i = 0; i < this.waiters.length; i++) {
      this.finish(this.waiters[i]);
    }
  }.observes("value"),
  
  finish: function(waiter) {
    if (waiter.didFinish) return;
    waiter.sendHeader(200, {"content-type":"text/plain"});
    waiter.sendBody("Value: " + this.get("value"));
    waiter.finish();
    waiter.didFinish = true;
  }
});

var server = Server.create({
  valueBinding: "controller.saying"
});

http.createServer(function (request, response) {
  server.request(request, response);
}).listen(8002);