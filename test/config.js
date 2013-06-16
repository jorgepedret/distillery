var request   = require("request"),
    should    = require("should"),
    config    = require("./mock/config.json"),
    distillery;

describe("config", function () {
  it("should throw error if invalid config", function (done) {
    try {
      distillery = require("../lib/distillery")();
    } catch (e) {
      done();
    }
  });

  it("should expose config object", function (done) {
    config.port = 3101;
    distillery = require("../lib/distillery")(config);
    should.exist(distillery);
    distillery.config.should.have.property('api1');
    distillery.config.should.have.property('instagram2');
    distillery.config.should.have.property('api2');
    done();
  })
});