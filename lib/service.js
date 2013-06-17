var urlUtil     = require("url"),
    request     = require("request"),
    querystring = require("querystring"),
    debug       = require("debug")("distillery:service"),
    Service;

Service = function (config, app) {
  
  this.validateConfig(config);
  this.validateApp(app);

  this.config   = config;
  this.rules    = this.config.rules || {};
  this.auth     = this.config.auth || {};
  this.url      = config.url;
  this.app      = app;
  this.headers  = this.config.headers || [];
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

Service.prototype.setupCustomHeaders = function (res) {
  var headers = this.headers;
  for (var key in headers) {
    res.header(key, headers[key]);
  }
}

/*
 * Setups the route for this service
 */
Service.prototype.setupEndpoint = function () {
  var self = this,
      auth = self.get('auth'),
      url = self.url;

  self.app.put("/" + url + "/distillery/auth", function (req, res) {
    self.setupCustomHeaders(res);
    self.resetAuth(req.body);
    res.status(200);
    // Re-create the endpoints to they use the new auth
    self.restart();
    res.end();
  });

  self.app.all("/" + url + "/*", function (req, res) {
    
    var options = {},
        path    = req.params[0],
        method  = req.method,
        query   = req.query,
        uri     = urlUtil.resolve(self.config.remoteUrl, path),
        qs      = query;

    self.setupCustomHeaders(res);

    if (self.canAccess(req)) {

      if (auth.method.toLowerCase() === "get") {
        qs[auth.key] = auth.value;
      }
      
      options.method  = method;
      options.uri     = uri;
      options.qs      = qs;

      debug(method + ":" + uri, querystring.stringify(qs));

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

Service.prototype.get = function (key) {
  if (key) {
    return this.config[key];
  } else {
    return this.config;
  }
};

Service.prototype.resetAuth = function (auth_config) {
  this.config.auth = auth_config;
}

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
  var possible_routes = [
    "/" + this.url + "/distillery/auth",
    "/" + this.url + "/*"
  ]
  for (var method in this.app.routes) {
    for (var route in this.app.routes[method]) {
      for (var i in possible_routes) {
        if (this.app.routes[method][route].path == possible_routes[i]) {
          this.app.routes[method].splice(route, 1);
          break;
        }
      }
    }
  }
};

module.exports = Service;