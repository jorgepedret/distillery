var request     = require("request"),
    should      = require("should"),
    config      = require("./mock/config.json"),
    proxyUrl    = "http://localhost:3100/api1",
    proxyUrl2   = "http://localhost:3100/insta",
    helpers     = require("./mock/helpers"),
    Distillery  = require("../lib/distillery"),
    distillery;

describe("rules", function () {
  
  before(function (done) {
    distillery = new Distillery(config);
    distillery.start();
    helpers.setupAPIs(done);
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
    distillery.stop();
    helpers.teardownAPIs(done);
  });
});