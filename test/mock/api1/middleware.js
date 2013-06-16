var error         = require("./error"),
    client_id     = "xyz123",
    access_token  = "123xyz";

exports.requireClientId = function (req, res, next) {
  if (req.query && req.query.client_id) {
    if (req.query.client_id === client_id) {
      next();
    } else {
      error.invalidClientId(req, res);
    }
  } else {
    error.emptyClientId(req, res);
  }
}

exports.requireToken = function (req, res, next) {
  if (req.query && req.query.access_token) {
    if (req.query.access_token === access_token) {
      next();
    } else {
      error.invalidToken(req, res);
    }
  } else {
    error.emptyToken(req, res);
  }
}