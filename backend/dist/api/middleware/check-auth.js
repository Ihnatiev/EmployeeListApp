"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = __importStar(require("jsonwebtoken"));
const secret_1 = __importDefault(require("../config/secret"));
exports.checkJwt = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, secret_1.default.jwtSecret);
        req.userData = {
            email: decodedToken.email,
            userId: decodedToken.userId
        };
        next();
    }
    catch (error) {
        res.status(401).json({ message: 'You are not authenticated!' });
    }
};
