import * as path from 'path';
import { Request, Response, NextFunction } from 'express';
import * as express from 'express';
const app = express.default();

// CORS
// see
// - https://stackoverflow.com/questions/50968152/cross-origin-request-blocked-with-react-and-express
// - https://brianflove.com/2017-03-22/express-cors-typescript/
// - https://www.twilio.com/blog/add-cors-support-express-typescript-api
// the TypeScript way
// ???
// the JavaScript Way... works
const cors = require('cors');
app.use(cors())

// data
app.get('/rocketleague/api/all', function (req: Request, res: Response, next: NextFunction) {
  res.sendFile(path.join(__dirname + '/../all.json'));
});

app.get('/rocketleague/api/total', function (req: Request, res: Response, next: NextFunction) {
  res.sendFile(path.join(__dirname + '/../total.json'));
});

// start server on port
const port = 9837;
app.set('port', port)
const server = app.listen(app.get('port'), () => {
    console.log(`App is running on http://localhost:${app.get('port')}`);
})