import fs from 'fs';
import app from './api/app';
import https from 'https';
import routes from './api/routes/routes';
import middleware from './api/middleware';
import { applyMiddleware, applyRoutes } from './api/utils';
import errorHandlers from './api/middleware/errorHandlers';

applyMiddleware(middleware, app);
applyRoutes(routes, app);
applyMiddleware(errorHandlers, app);

const httpsOptions = {
  key: fs.readFileSync('./api/config/key.pem'),
  cert: fs.readFileSync('./api/config/cert.pem')
};

const { PORT = 4222 } = process.env;
const srvr = https.createServer(httpsOptions, app);

srvr.listen(PORT, () =>
  console.log(`Server is running https://localhost:${PORT}`)
);

export default srvr;
