var express     = require("express"),
    app         = express(),
    port        = process.env.PORT || 3000,
    config      = require("./test/mock/config.json"),
    Distillery  = require("./lib/distillery"),
    helpers     = require("./test/mock/helpers"),
    distillery;

// Setup helper APIs so the examples work
helpers.setupAPIs();

// Instantiate and start distillery
distillery = new Distillery(config, app);
distillery.start();

// Start express server
app.listen(port);
console.log("Express + Distillery server is running on port " + port);

// http://localhost:3000/api2/topic.json/bjj/followers
// http://localhost:3000/api1/media/popular