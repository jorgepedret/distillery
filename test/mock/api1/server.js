/*
 * Mock API #1
 */
module.exports = function (){
  var express   = require("express"),
      app       = express(),
      port      = 3001,
      m         = require("./middleware"),
      error     = require("./error"),
      response  = require("./response");

  app.get("/media/popular", m.requireClientId, function (req, res) {
    res.status(200);
    res.json(response.media_popular);
  });

  app.get("/users/search", m.requireClientId, function (req, res) {
    res.status(200);
    res.json(response.users_search);
  });

  app.get("/users/self/feed", m.requireToken, function (req, res) {
    res.status(200);
    res.json(response.users_self_feed);
  });
  
  return app;
}