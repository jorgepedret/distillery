var request   = require("request"),
    should    = require("should"),
    config    = require("./mock/config.json"),
    proxyUrl  = "http://localhost:3102/api1",
    proxyUrl2 = "http://localhost:3102/insta",
    helpers = require("./mock/helpers"),
    distillery;

describe("request", function () {
  
  before(function (done) {
    config.port = 3102;
    distillery = require("../lib/distillery")(config).init();
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

  it("should not call methods blocked in config", function (done) {
    var data = {
      form: {
        text: "Lorem ipsum Cupidatat in dolor"
      }
    }
    request.post(proxyUrl + "/media/555/comments", data, function (err, res, body) {
      res.statusCode.should.eql(404);
      done();
    });
  });

  it("should not call paths blocked in config", function (done) {
    request.get(proxyUrl + "/users/search?q=jorge", function (err, res, body) {
      res.statusCode.should.eql(404);
      done();
    });
  });

  after(function (done) {
    helpers.teardownAPIs(done);
  });
});