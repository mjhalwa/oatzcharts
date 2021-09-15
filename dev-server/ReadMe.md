# Express Development Server

Serves static jsons for developing OATZ Charts frontend.

Pros:

- `oatz.net` does not allow `localhost` in __CORS__ -> will get CORS Error while developing
- allows to serve custom JSON files
- allows to debug, even if `oatz.net` is down

Servs:

- `http://localhost:9837/rocketleague/api/all`
- `http://localhost:9837/rocketleague/api/total`

port is set hardcoded as __9837__
