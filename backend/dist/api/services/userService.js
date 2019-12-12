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
const userModel_1 = require("../models/userModel");
const uuid_1 = require("uuid");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class UserService {
    constructor(connection) {
        this.connection = connection;
    }
    ;
    signup(name, email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = new userModel_1.User();
            user.id = uuid_1.v4();
            user.name = name;
            user.email = email;
            user.password = bcryptjs_1.default.hashSync(password, 10);
            yield this.connection.execute('INSERT INTO EmployeeDB.Users SET id = ?, name = ?, email = ?, password = ?', [
                user.id,
                user.name,
                user.email,
                user.password
            ]);
            user.id = user.id;
            return user;
        });
    }
    login(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryResults = yield this.connection.execute('SELECT * FROM EmployeeDB.Users WHERE email = ?', [email]);
            return queryResults[0];
        });
    }
}
exports.UserService = UserService;
