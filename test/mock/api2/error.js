exports.forbidden = function (req, res) {
  res.status(403);
  res.end();
}