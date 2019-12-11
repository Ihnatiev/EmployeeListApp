"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const app_1 = __importDefault(require("./api/app"));
const https_1 = __importDefault(require("https"));
const routes_1 = __importDefault(require("./api/routes/routes"));
const middleware_1 = __importDefault(require("./api/middleware"));
const utils_1 = require("./api/utils");
const errorHandlers_1 = __importDefault(require("./api/middleware/errorHandlers"));
app_1.default.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, X-Auth-Token , Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
    next();
});
utils_1.applyMiddleware(middleware_1.default, app_1.default);
utils_1.applyRoutes(routes_1.default, app_1.default);
utils_1.applyMiddleware(errorHandlers_1.default, app_1.default);
const httpsOptions = {
    key: fs_1.default.readFileSync('./api/config/key.pem'),
    cert: fs_1.default.readFileSync('./api/config/cert.pem')
};
const { PORT = 4201 } = process.env;
const srvr = https_1.default.createServer(httpsOptions, app_1.default);
srvr.listen(PORT, () => console.log(`Server is running https://localhost:${PORT}`));
exports.default = srvr;
