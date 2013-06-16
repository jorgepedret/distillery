var request   = require("request"),
    should    = require("should"),
    config    = require("./mock/config.json"),
    helpers = require("./mock/helpers"),
    api1Url   = "http://localhost:3103/api1",
    distillery;

describe("init", function () {
  
  before(function (done) {
    config.port = 3103;
    distillery = require("../lib/distillery")(config);
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
    distillery.init();
    request.get(api1Url + "/media/popular", function (err, res, body) {
      should.not.exist(err);
      should.exist(res);
      res.statusCode.should.eql(200);
      done();
    });
  });

  after(function (done) {
    helpers.teardownAPIs(done);
  });
});