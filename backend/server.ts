import fs from 'fs';
import app from './api/app';
import https from 'https';
import routes from './api/routes/routes';
import middleware from './api/middleware';
import { applyMiddleware, applyRoutes } from './api/utils';
import errorHandlers from './api/middleware/errorHandlers';

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, X-Auth-Token , Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, PUT, DELETE, OPTIONS'
  );
  next();
});

applyMiddleware(middleware, app);
applyRoutes(routes, app);
applyMiddleware(errorHandlers, app);

const httpsOptions = {
  key: fs.readFileSync('./api/config/key.pem'),
  cert: fs.readFileSync('./api/config/cert.pem')
};

const { PORT = 4201 } = process.env;
const srvr = https.createServer(httpsOptions, app);

srvr.listen(PORT, () =>
  console.log(`Server is running https://localhost:${PORT}`)
);
export default srvr;
