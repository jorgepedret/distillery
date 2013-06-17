var request   = require("request"),
    should    = require("should"),
    config    = require("./mock/config.json"),
    binteoUrl  = "http://localhost:3100/api2",
    instagUrl = "http://localhost:3100/api1",
    helpers = require("./mock/helpers"),
    Distillery = require("../lib/distillery"),
    distillery;

describe("auth", function () {

  before(function (done) {
    distillery = new Distillery(config);
    distillery.start();
    helpers.setupAPIs(done);
  });
  
  it("should get default auth", function (done) {
    request.get(binteoUrl + "/topic.json/bjj/followers", function (err, res, body) {
      var obj = {};
      should.not.exist(err);
      body.should.be.ok;
      should.exist(res);
      try {
        obj = JSON.parse(body);
        obj.should.have.property('items');
        obj.should.have.property('total');
        done();
      } catch (e) {
        done(new Error("API returned invalid json payload"));
      }
    });
  });
  
  after(function (done) {
    distillery.stop(function () {
      helpers.teardownAPIs(done);
    });
  });
});