var express     = require("express"),
    app         = express(),
    port        = process.env.PORT || 3000,
    config      = require("./config"),
    Distillery  = require("./lib/distillery"),
    distillery;

// Configure express server
app.configure(function () {
  app.use(express.bodyParser());
  app.use(express.cookieParser({ secret: "istrlieldy" }));
  app.use(express.methodOverride());
});

// Instantiate and start distillery
distillery = new Distillery(config, app);
distillery.start();

// Start express server
app.listen(port);
console.log("Express + Distillery server is running on port " + port);

// Go ahead and try this URLs:
// http://localhost:3000/api2/topic.json/bjj/followers
// http://localhost:3000/api1/media/popular

// From an external server using codepen.io
// http://codepen.io/jorgepedret/pen/rHvgj