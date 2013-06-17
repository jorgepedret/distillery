var port        = process.env.PORT || 3100,
    express     = require("express"),
    helpers     = require("./helpers"),
    Service     = require("./service"),
    distillery  = {},
    createServer, app,
    debug       = require("debug")("distillery"),
    service,
    Distillery;

Distillery = function (config, app) {
  
  this.config     = config || {};
  this.services   = {};
  this.app        = app || null;
  this.serverMode = false;
  this.server     = {};

  this.initialize();
}

Distillery.prototype.configure = function (config) {
  var temp_config = this.config;
  this.config = helpers.merge(config, temp_config);
}

Distillery.prototype.getApp = function () {
  var self = this;
  if (!self.app) {
    self.serverMode = true;
    self.app = express();
    self.app.configure(function () {
      self.app.use(express.bodyParser());
      self.app.use(express.cookieParser({ secret: "istrlieldy" }));
      self.app.use(express.methodOverride());
    });
  }
  return self.app;
}

Distillery.prototype.initialize = function () {
  var services = this.config.services || {},
      app = this.getApp();

  for (var service_id in services) {
    if (!services[service_id].url) {
      services[service_id].url = service_id;
    }
    this.services[service_id] = new Service(services[service_id], app);
  }
}

Distillery.prototype.get = function (service_id) {
  return this.services[service_id] || null;
}

Distillery.prototype.stop = function (callback) {
  if (this.serverMode && this.server) {
    this.server.close(function () {
      debug("server:stop", "Distillery stopped listening on port " + port);
      if (typeof callback == "function") {
        callback();
      }
    });
  }
}

Distillery.prototype.start = function (callback) {
  debug("start:all");
  for (var key in this.services) {
    debug("start:" + key, "starting");
    this.services[key].start();
  }
  
  if (this.serverMode) {
    if (this.config.port) port = this.config.port;
    this.server = this.app.listen(port, function () {
      debug("server:start", "Distillery started listening on port " + port);
      if (typeof callback == "function") {
        callback();
      }
    });
  }
}

module.exports = Distillery;