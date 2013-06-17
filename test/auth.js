var request     = require("request"),
    should      = require("should"),
    config      = require("./mock/config.json"),
    api2Url     = "http://localhost:3100/api2",
    api1Url     = "http://localhost:3100/api1",
    helpers     = require("./mock/helpers"),
    Distillery  = require("../lib/distillery"),
    distillery;

describe("auth", function () {

  before(function (done) {
    distillery = new Distillery(config);
    distillery.start();
    helpers.setupAPIs(done);
  });
  
  it("should get default auth", function (done) {
    request.get(api2Url + "/topic.json/bjj/followers", function (err, res, body) {
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

  it("should change auth through endpoint", function (done) {
    var api2 = distillery.get('api2'),
        api2auth = api2.get('auth'),
        options = {
          uri: api2Url + "/distillery/auth",
          form: {
            method: "get",
            key: "token",
            value: "123xyz"
          }
        };

    api2auth.should.have.property('key', 'key');
    api2auth.should.have.property('value', 'foobar');

    request.put(options, function (err, res, body) {
      var api2 = distillery.get('api2'),
          api2auth = api2.get('auth');
      api2auth.should.have.property('key', 'token');
      api2auth.should.have.property('value', '123xyz');
      done();
    });
    // done();
  });

  it("should use new auth values", function (done) {
    var api2 = distillery.get('api2'),
        api2auth = api2.get('auth');

    request.get(api2Url + "/account.json/123", function (err, res, body) {
      should.not.exist(err);
      res.statusCode.should.not.eql(403);
      try {
        var data = JSON.parse(body);
        data.should.be.a('object');
        data.should.have.property('username', 'felipe');
        done();
      } catch (e) {
        done(new Error("Endpoint returned invalida JSON data"));
      }
    });
  });
  
  after(function (done) {
    distillery.stop();
    helpers.teardownAPIs(done);
  });
});