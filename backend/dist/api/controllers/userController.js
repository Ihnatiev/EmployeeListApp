"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userService_1 = require("../services/userService");
const secret_1 = __importDefault(require("../config/secret"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class UserController {
    constructor(dbConnection) {
        this.userService = new userService_1.UserService(dbConnection);
    }
    createUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, email, password } = req.body;
                yield this.userService.signup(name, email, password)
                    .then(user => {
                    res.status(201).json({
                        success: true,
                        message: 'User created!',
                        userId: user.id
                    });
                }).catch(err => {
                    res.status(500).json({
                        success: false,
                        message: 'Invalid authentication credentials!'
                    });
                });
            }
            catch (_a) {
                res.status(500).json({
                    success: false,
                    message: 'Server error'
                });
            }
            ;
        });
    }
    ;
    loginUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const email = req.body.email;
            const password = req.body.password;
            yield this.userService.login(email)
                .then((user) => __awaiter(this, void 0, void 0, function* () {
                if (!user) {
                    return res.status(400).json({
                        success: false,
                        message: 'Auth failed! Check your email.'
                    });
                }
                else {
                    const result = yield bcryptjs_1.default.compare(password, user.password);
                    const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email }, secret_1.default.jwtSecret, { algorithm: 'HS256', expiresIn: '1h' });
                    (!result) ?
                        res.status(401).json({
                            success: false,
                            message: 'Email and password does not match.'
                        }) :
                        res.status(200).json({
                            token: token,
                            expiresIn: 3600,
                            userId: user.id,
                            userName: user.name
                        });
                }
            }))
                .catch(err => {
                res.status(500).json({
                    success: false,
                    message: 'Server error'
                });
            });
        });
    }
    ;
}
exports.UserController = UserController;
