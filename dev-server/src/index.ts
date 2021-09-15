import * as path from 'path';
import { Request, Response, NextFunction } from 'express';
import * as express from 'express';
const app = express.default();


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