var urlUtil     = require("url"),
    request     = require("request"),
    querystring = require("querystring"),
    debug       = require("debug")("distillery:service"),
    Service;

Service = function (config, app) {
  
  this.validateConfig(config);
  this.validateApp(app);

  this.config = config;
  this.rules  = this.config.rules || {};
  this.auth   = this.config.auth || {};
  this.url    = config.url;
  this.app    = app;
}

Service.prototype.validateApp = function (app) {
  if (!app) {
    throw new Error("An app must be specified to instantiate a Service");
  }
}

Service.prototype.validateConfig = function (config) {
  if (!config) {
    throw new Error("Config object must be present when instantiating a Service");
  }
  if (!config.url) {
    throw new Error("Config object must contain url");
  }
  if (!config.remoteUrl) {
    throw new Error("Config object must contain remoteUrl");
  }
}
  
/*
 * Returns weather the current endpoint can be access
 */
Service.prototype.canAccess = function (req) {
  var rules   = this.rules,
      path    = req.params[0],
      method  = req.method;
  
  if (rules.deny) {
    if (rules.deny.methods && rules.deny.methods.indexOf(method.toLowerCase()) !== -1) {
      return false;
    }
    if (rules.deny.paths && rules.deny.paths.indexOf(path) !== -1) {
      return false;
    }
  }
  return true;
}

/*
 * Setups the route for this service
 */
Service.prototype.setupEndpoint = function () {
  var self = this,
      auth = this.auth,
      url = this.url;

  this.app.all("/" + url + "/*", function (req, res) {
    
    var options = {},
        path    = req.params[0],
        method  = req.method,
        query   = req.query,
        uri     = urlUtil.resolve(self.config.remoteUrl, path),
        qs      = query;

    debug(url, method + " " + path + "?" + querystring.stringify(qs));

    if (self.canAccess(req)) {

      if (auth.method.toLowerCase() === "get") {
        qs[auth.key] = auth.value;
      }
      
      options.method  = method;
      options.uri     = uri;
      options.qs      = qs;

      request(options, function (err, response, body) {
        if (err) {
          res.status(500);
          res.json({ "error": err.message || "Error calling the API endpoint" });
          res.end();
        } else {
          try {
            var obj = JSON.parse(body);
            res.status(response.statusCode);
            res.json(obj);
          } catch (e) {
            res.status(response.statusCode);
            res.end(body);
          }
        }
      });
    } else {
      res.status(404);
      res.json({ "error": "Endpoint not found" });
    }
  });
}

Service.prototype.get = function () {
  return this.config;
};

Service.prototype.set = function (config) {
  this.config = helpers.merge(config, this.config);
  return this.config;
};

Service.prototype.restart = function () {
  this.stop();
  this.start();
};

Service.prototype.start = function () {
  this.setupEndpoint();
};

Service.prototype.stop = function () {
  // TODO: Remove route from route table
};

module.exports = Service;