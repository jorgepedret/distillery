var express     = require("express"),
    app         = express(),
    port        = process.env.PORT || 3000,
    config      = require("./test/mock/config.json"),
    distillery  = require("./lib/distillery")(config, app);

app.listen(port);
console.log("Distillery server is running on port " + port);