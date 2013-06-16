var request   = require("request"),
    should    = require("should"),
    config    = require("./mock/config.json"),
    binteoUrl  = "http://localhost:9966/binteo",
    instagUrl = "http://localhost:9966/instagram",
    helpers = require("./mock/helpers"),
    distillery;

describe("auth", function () {

  before(function (done) {
    config.port = 9966;
    distillery = require("../lib/distillery")(config);
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
  
  // it("should reset auth method", function (done) {
    
  //   distillery.auth({
  //     method: "get",
  //     key: "token",
  //     value: "5Qk553fNCvWS-rVHTkMTf9OxJ8A%7Chhfk2ho0:i37PW6R8odbBJrn0wjdgvgoBIJsleyiJ1dt7iZ74M8V0mQju58DeaMESfTgmGdqXDNylS9ayU"
  //   });

  //   request.get(binteoUrl + "/topic.json/bjj/followers", function (err, res, body) {
  //     var obj = {};
  //     should.not.exist(err);
  //     body.should.be.ok;
  //     try {
  //       obj = JSON.parse(body);
  //       obj.should.have.property('items');
  //       obj.should.have.property('total');
  //     } catch (e) {
  //       done("API returned invalid json payload");
  //     }
  //     done();
  //   });
  // })
  after(function (done) {
    helpers.teardownAPIs(done);
  });
});