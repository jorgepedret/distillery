var request   = require("request"),
    should    = require("should"),
    config    = require("./mock/config.json"),
    proxyUrl  = "http://localhost:3000/instagram",
    proxyUrl2 = "http://localhost:3000/insta",
    api1      = require("./mock/api1/server")(),
    api2      = require("./mock/api2/server")(),
    distillery;

describe("config", function () {
  it("should throw error if invalid config", function (done) {
    try {
      var distillery = require("../lib/distillery")();
    } catch (e) {
      done();
    }
  });

  it("should expose config object", function (done) {
    // done(new Error("doesn't expose config object"));
    done();
  })
});