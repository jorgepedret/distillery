var request     = require("request"),
    should      = require("should"),
    config      = require("./mock/config.json"),
    proxyUrl    = "http://localhost:3100/api1",
    proxyUrl2   = "http://localhost:3100/insta",
    helpers     = require("./mock/helpers"),
    Distillery  = require("../lib/distillery"),
    distillery;

describe("request", function () {
  
  before(function (done) {
    distillery = new Distillery(config);
    distillery.start();
    helpers.setupAPIs(done);
  });
  
  it("should create endpoints", function (done) {
    request.get(proxyUrl + "/media/popular", function (err, res, body) {
      should.not.exist(err);
      res.statusCode.should.eql(200);
      done();
    });
  });

  it("should accept custom name endpoint", function (done) {
    request.get(proxyUrl2 + "/media/popular", function (err, res, body) {
      should.not.exist(err);
      res.statusCode.should.eql(200);
      done();
    });
  });
  
  it("should get data from api", function (done) {
    request.get(proxyUrl + "/media/popular", function (err, res, body) {
      should.not.exist(err);
      try {
        var obj = JSON.parse(body);
        obj.should.be.a('object');
        obj.should.have.property("meta");
        obj.should.have.property("data");
        obj.data.length.should.be.above(0);
        done();
      } catch (e) {
        done(e);
      }
    });
  });

  it("should return API error status code", function (done) {
    request.get(proxyUrl + "/users/self/feed", function (err, res, body) {
      res.statusCode.should.eql(400);
      done();
    });
  });

  after(function (done) {
    distillery.stop();
    helpers.teardownAPIs(done);
  });
});