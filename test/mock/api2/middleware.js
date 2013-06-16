var error = require("./error"),
    key   = "foobar",
    token = "123xyz";

exports.requireKey = function (req, res, next) {
  if (req.query && req.query.key && req.query.key === key) {
    next();
  } else {
    error.forbidden(req, res);
  }
}
exports.requireToken = function (req, res, next) {
  if (req.query && req.query.token && req.query.token === token) {
    next();
  } else {
    error.forbidden(req, res);
  }
}