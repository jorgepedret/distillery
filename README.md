# Distillery

Talk to a remote API without needing to expose your secret token or all the API endpoints

## The problem

Distillery was created to __secure the communication with a remote APIs from the browser__.

To talk to public APIs, (i.e.: Instagram, Twitter, etc.) you need a secret token which gives you access to the API endpoints. You __can't__ let other people know about this secret token, or they could do nasty things to your account.

Distillery is a NodeJS library that proxies the API calls through, while hiding your secret token. You can also specify what methods and specific endpoints you want to deny or allow access to.

## Instagram API Example

Example configuration:

```
// destillery.json
{
  "instagram": {
    "remoteUrl": "https://api.instagram.com/v1/",
    "auth": {
      "method": "get",
      "key": "client_id",
      "value": "cfxxxxxxxxxxxxxxxxxxxxxxxxxxxx13"
    },
    "deny": {
      "methods": ["post"],
      "paths": [ "users/search" ]
    }
  }
}
```

Run the server:

```
$ node server.js
Distillery is running on port 3000
```

Or use it like a library:

```
var express     = require("express"),
    app         = express(),
    distillery  = require("distillery")(config.distillery, app);
    
    app.listen(3000);
```

Consume the API:

```
// http://instagram.com/developer/endpoints/media/#get_media_popular
$ curl "http://localhost:3000/instagram/media/popular"
{
  "meta": {
    "code": 200
  },
  "data": [
    {
      "attribution": null,
      "tags": [],
      "location": null,
      "comments": {
        "count": 48,
        "data": [
        ...
```

Trying to access blocked paths or methods will return a 404 error:

```
// http://instagram.com/developer/endpoints/users/#get_users_search
$ curl "http://localhost:3000/instagram/users/search?q=jorge"
{
  "error": "Endpoint not found"
}
```

## TODO
- Add distillery to NPM list
- Support standard (and popular APIs) ways of authenticating
- Improve the way deny/allow works
- Switch to a lighter HTTP server (replace express)
- Expose an endpoint to reset auth key
- Solution for cross-domain issues

## License
MIT