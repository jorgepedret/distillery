exports.invalidClientId = function (req, res) {
  var response = {
    meta: {
      error_type: 'OAuthClientException',
      code: 400,
      error_message: 'The "client_id" provided is invalid and does not match a valid application.'
    }
  };
  res.status(400);
  res.json(response);
}
exports.emptyClientId = function (req, res) {
  var response = {
    meta: {
      error_type: 'OAuthParameterException',
      code: 400,
      error_message: '"client_id" or "access_token" URL parameter missing. This OAuth request requires either a "client_id" or "access_token" URL parameter.' 
    }
  };
  res.status(400);
  res.json(response);
}
exports.invalidToken = function (req, res) {
  var response = {
    "meta": {
      "error_type": "OAuthAccessTokenException",
      "code": 400,
      "error_message": "The \"access_token\" provided is invalid."
    }
  };
  res.status(400);
  res.json(response);
}
exports.emptyToken = function (req, res) {
  var response = {
    "meta": {
      "error_type": "OAuthException",
      "code": 400,
      "error_message": "\"access_token\" URL parameter missing. This OAuth request requires an \"access_token\" URL parameter."
    }
  };
  res.status(400);
  res.json(response);
}