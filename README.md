# Distillery

Talk to a remote API without needing to expose your secret token or all the API endpoints

## The problem

Distillery was created to __secure the communication with a remote APIs from the browser__.

To talk to public APIs, (i.e.: Instagram, Twitter, etc.) you need a secret token which gives you access to the API endpoints. You __can't__ let other people know about this secret token, or they could do nasty things to your account.

Distillery is a NodeJS library that proxies the API calls through, while hiding your secret token. You can also specify what methods and specific endpoints you want to deny or allow access to.

## Install

Use __npm__ to install it in your project:

```
$ npm install distillery
```

Or __clone__ it using git:
```
$ git clone git@github.com:jorgepedret/distillery.git
```

Or __download__ it from github [https://github.com/jorgepedret/distillery/archive/master.zip](https://github.com/jorgepedret/distillery/archive/master.zip)

## Instagram API Example Server

Example configuration:

```
// config.json
{
  "services": {
    "instagram": {
      "remoteUrl": "https://api.instagram.com/v1/",
      "auth": {
        "method": "get",
        "key": "client_id",
        "value": "cfxxxxxxxxxxxxxxxxxxxxxxxxxxxx13"
      },
      "rules": {
        "deny": {
          "methods": ["post", "put"],
          "paths": ["users/search"]
        }
      }
    }
  }
}
```

Run the server:

```
$ node server.js
Express + Distillery server is running on port 3000
```

Or use it like a library:

```
var express     = require("express"),
    app         = express(),
    config      = require("./config"),
    Distillery  = require("distillery");

var distillery_app = new Distillery(config, app);
distillery_app.start();

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

View example in codepen: [http://codepen.io/jorgepedret/pen/rHvgj](http://codepen.io/jorgepedret/pen/rHvgj) (You must be locally running the distillery server on port 3000)

Trying to access __blocked paths or methods__ will return a 404 error:

```
// http://instagram.com/developer/endpoints/users/#get_users_search
$ curl "http://localhost:3000/instagram/users/search?q=jorge"
{
  "error": "Endpoint not found"
}
```

## Documentation
TODO (See the `test` directory for implementation details)

## TODO
- Support standard (and popular APIs) ways of authenticating
- Improve the way deny/allow works
- Switch to a lighter HTTP server (replace express)

## License
MIT