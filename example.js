// an attempt at a more practical test
var sys = require("sys"), http = require("http");

var SC = require("./runtime").SC;
process.mixin(GLOBAL, {
  YES: true,
  NO: false
});

// this is pretty pathetic, but still, it is an example
// no message queuing means it would never work, though :)
var Server = SC.Object.extend({
  value: "Hi",
  waiters: [],
  request: function(request, response){
    if (request.uri.path == "/change") {
      this.set("value", request.uri.params["to"]);
      response.sendHeader(200, {"content-type": "text/plain"});
      response.sendBody("Done!");
      response.finish();
    } else {
      this.waiters.push(response);
      var self=this;
      setTimeout(function(){ 
        self.finish(response);
      }, 30000); // do it automatically after 30 seconds.
    }
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
  value: "Hello, World!"
});

http.createServer(function (request, response) {
  server.request(request, response);
}).listen(8002);