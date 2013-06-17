var request   = require("request"),
    should    = require("should"),
    config    = require("./mock/config.json"),
    Distillery = require("../lib/distillery"),
    distillery;

describe("config", function () {
  
  before(function (done) {
    distillery = new Distillery(config);
    done();
  });

  it("should reset config", function (done) {
    var test_distillery = new Distillery();
    should.exist(test_distillery);
    should.exist(test_distillery.config);
    test_distillery.config.should.be.a('object');
    test_distillery.config.should.not.have.property('services');
    test_distillery.config.should.be.eql({});
    
    // Reset config
    test_distillery.configure(config);
    should.exist(test_distillery.config);
    test_distillery.config.should.be.a('object');
    test_distillery.config.should.have.property('services');

    done();
  });

  it("should contain distillery instance methods", function (done) {
    should.exist(distillery);
    distillery.should.have.property('start');
    distillery.should.have.property('stop');
    distillery.should.have.property('services');
    done();
  });

  it("should return return service object", function (done) {
    var api1 = distillery.get('api1');
    should.exist(api1);
    api1.should.be.a("object");
    api1.should.have.property('config');
    done();
  });

});