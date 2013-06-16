var urlUtil     = require("url"),
    port        = process.env.PORT || 3000,
    request     = require("request"),
    distillery  = {},
    createServer, app,
    serverMode  = false;

createServer = function () {
  var express = require("express");
  serverMode = true;
  return express();
}

distillery = function (config, app) {
  var self = this,
      setupEndpoint;
  
  // TODO: Create a validate config function
  if (!config || typeof config != "object") {
    throw new Error("Invalid config");
  }
  // Detect if app was passed to distillery
  // Creates its own server if app was not specified
  if (!app) {
    self.app = createServer();
  } else {
    self.app = app;
  }

  setupEndpoint = function (url, conf) {
    var auth = conf.auth,
        canCall;

    canCall = function (url, path, method, query) {
      if (conf.deny) {
        if (conf.deny.methods && conf.deny.methods.indexOf(method.toLowerCase()) !== -1) {
          return false;
        }
        if (conf.deny.paths && conf.deny.paths.indexOf(path) !== -1) {
          return false;
        }
      }
      return true;
    }

    if (conf.url) {
      url = conf.url;
    }
    
    self.app.all("/" + url + "/*", function (req, res) {
      
      var options = {},
          path    = req.params[0],
          method  = req.method,
          query   = req.query,
          uri     = urlUtil.resolve(conf.remoteUrl, path),
          qs      = query;
      
      if (auth.method.toLowerCase() === "get") {
        qs[auth.key] = auth.value;
      }

      if (canCall(url, path, method, query)) {
        
        options.method  = method;
        options.uri     = uri;
        options.qs      = qs;

        request(options, function (err, response, body) {
          if (err) {
            res.status(500);
            res.json({ "error": err.message||"Error calling the API endpoint" });
            res.end();
          }
          try {
            var obj = JSON.parse(body);
            res.status(response.statusCode);
            res.json(obj);
          } catch (e) {
            res.status(response.statusCode);
            res.end(body);
          }
        });
      } else {
        res.status(404);
        res.json({ "error": "Endpoint not found" });
      }
    });
  }
  
  for (var key in config) {
    setupEndpoint(key, config[key]);
  }
  self.server = {};
  if (serverMode) {
    if (config.port) port = config.port;
    self.app.listen(port);
    console.log("Distillery is running on port " + port);
  }
}

module.exports = distillery;