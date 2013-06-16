/*
 * Mock API #2
 */
module.exports = function (){
  var express   = require("express"),
      app       = express(),
      port      = 3002,
      m         = require("./middleware"),
      error     = require("./error"),
      response  = require("./response");

  app.get("/topic.json/bjj/followers", m.requireKey, function (req, res) {
    res.status(200);
    res.json(response.topic_followers);
  });

  app.get("/account.json/:userid", m.requireToken, function (req, res) {
    res.status(200);
    res.json(response.account);
  });
  
  return app;
}