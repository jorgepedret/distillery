var request     = require("request"),
    should      = require("should"),
    config      = require("./mock/config.json"),
    api1Url     = "http://localhost:3100/api1",
    api1CopyUrl = "http://localhost:3100/insta",
    api2Url     = "http://localhost:3100/api2",
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
    request.get(api1Url + "/media/popular", function (err, res, body) {
      should.not.exist(err);
      res.statusCode.should.eql(200);
      done();
    });
  });

  it("should accept custom name endpoint", function (done) {
    request.get(api1CopyUrl + "/media/popular", function (err, res, body) {
      should.not.exist(err);
      res.statusCode.should.eql(200);
      done();
    });
  });
  
  it("should get data from api", function (done) {
    request.get(api1Url + "/media/popular", function (err, res, body) {
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
    request.get(api1Url + "/users/self/feed", function (err, res, body) {
      res.statusCode.should.eql(400);
      done();
    });
  });

  it("should add general custom headers", function (done) {
    request.get(api2Url + "/topic.json/bjj/followers", function (err, res, body) {
      should.exist(res.headers);
      res.headers.should.have.property('access-control-allow-origin', 'http://example.com');
      done();
    });
  });

  it("should add custom headers to service", function (done) {
    request.get(api1Url + "/media/popular", function (err, res, body) {
      should.exist(res.headers);
      res.headers.should.have.property('access-control-allow-origin', 'http://s.codepen.io');
      done();
    });
  });

  after(function (done) {
    distillery.stop();
    helpers.teardownAPIs(done);
  });
});