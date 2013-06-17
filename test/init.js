var request     = require("request"),
    should      = require("should"),
    config      = require("./mock/config.json"),
    helpers     = require("./mock/helpers"),
    Distillery  = require("../lib/distillery"),
    api1Url     = "http://localhost:3100/api1",
    distillery;

describe("init", function () {
  
  before(function (done) {
    distillery = new Distillery(config);
    helpers.setupAPIs(done);
  });
  
  it("should not start listening before running init", function (done) {
    request.get(api1Url + "/media/popular", function (err, res, body) {
      should.exist(err);
      should.not.exist(res);
      done();
    });
  });

  it("should start listening after running init", function (done) {
    distillery.start();
    request.get(api1Url + "/media/popular", function (err, res, body) {
      should.not.exist(err);
      should.exist(res);
      res.statusCode.should.eql(200);
      done();
    });
  });

  it("should stop listening after running stop", function (done) {
    distillery.stop();
    request.get(api1Url + "/media/popular", function (err, res, body) {
      should.exist(err);
      should.not.exist(res);
      done();
    });
  });

  after(function (done) {
    helpers.teardownAPIs(done);
  });
});