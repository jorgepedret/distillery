exports.setupAPIs = function (done) {
  exports.api1 = require("./api1/server")().listen(3001, function () {
    exports.api2 = require("./api2/server")().listen(3002, function () {
      if (typeof done == "function") {
        done();
      }
    });
  });
}

exports.teardownAPIs = function (done) {
  exports.api1.close(function () {
    exports.api2.close(function () {
      if (typeof done == "function") {
        done();
      }
    });
  });
}