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
Object.defineProperty(exports, "__esModule", { value: true });
const userController_1 = require("../../../controllers/userController");
const userService_1 = require("../../../services/userService");
jest.mock('../../../services/userService', () => {
    const mUserService = {
        signup: jest.fn(),
        login: jest.fn()
    };
    return { UserService: jest.fn(() => mUserService) };
});
describe('Users', () => {
    describe('Signup', () => {
        afterEach(() => {
            jest.clearAllMocks();
        });
        test('should return status 201 - user created', () => __awaiter(void 0, void 0, void 0, function* () {
            const mConnection = {
                execute(query, params) { }
            };
            const userService = new userService_1.UserService(mConnection);
            userService.signup
                .mockResolvedValueOnce({
                id: '87ed8836-efaf-4dcf-baaa-d94e2358fc6b',
                name: 'Test User',
                email: 'test-email@gmail.com',
                password: '$2b$10$p/aOc7IChl53tL9rSJbM1.fMz2Nz62lkRG94YaULkBxbpey1zw7Uy'
            });
            const mReq = {
                body: {
                    name: 'Test User',
                    email: 'test-email@gmail.com',
                    password: 'testUserPass'
                }
            };
            const mRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            const userController = new userController_1.UserController(mConnection);
            yield userController.createUser(mReq, mRes);
            expect(userService.signup).toHaveBeenCalledTimes(1);
            expect(mRes.status).toBeCalledWith(201);
            expect(mRes.status().json).toBeCalledWith({
                success: true,
                message: 'User created!',
                userId: '87ed8836-efaf-4dcf-baaa-d94e2358fc6b'
            });
        }));
        test('should return status 500 - invalid authentication credentials', () => __awaiter(void 0, void 0, void 0, function* () {
            const mConnection = {
                execute(query, params) { }
            };
            const userService = new userService_1.UserService(mConnection);
            userService.signup
                .mockImplementation(() => Promise.resolve());
            const mReq = {
                body: {
                    name: '',
                    email: 'test-email@gmail.com',
                    password: 'testUserPass'
                }
            };
            const mRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            const userController = new userController_1.UserController(mConnection);
            yield userController.createUser(mReq, mRes);
            expect(userService.signup).toHaveBeenCalledTimes(1);
            expect(mRes.status).toBeCalledWith(500);
            expect(mRes.status().json).toBeCalledWith({ success: false, message: 'Invalid authentication credentials!' });
        }));
    });
    describe('Login', () => {
        afterEach(() => {
            jest.clearAllMocks();
        });
        test('should return status 200 - user login', () => __awaiter(void 0, void 0, void 0, function* () {
            const mConnection = {
                execute(query, params) { }
            };
            const userService = new userService_1.UserService(mConnection);
            userService.login
                .mockResolvedValueOnce({
                id: '87ed8836-efaf-4dcf-baaa-d94e2358fc6b',
                name: 'Test User',
                email: 'test-email@gmail.com',
                password: '$2b$10$p/aOc7IChl53tL9rSJbM1.fMz2Nz62lkRG94YaULkBxbpey1zw7Uy'
            });
            const mReq = {
                body: {
                    email: 'test-email@gmail.com',
                    password: 'testUserPass'
                }
            };
            const mRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            const userController = new userController_1.UserController(mConnection);
            yield userController.loginUser(mReq, mRes);
            expect(userService.login).toHaveBeenCalledTimes(1);
            expect(mRes.status).toBeCalledWith(200);
            expect(mRes.status().json).toBeCalledWith({
                token: expect.anything(),
                expiresIn: 3600,
                userId: '87ed8836-efaf-4dcf-baaa-d94e2358fc6b',
                userName: 'Test User'
            });
        }));
        test('should return status 400 - wrong email', () => __awaiter(void 0, void 0, void 0, function* () {
            const mConnection = {
                execute(query, params) { }
            };
            const userService = new userService_1.UserService(mConnection);
            userService.login
                .mockResolvedValueOnce();
            const mReq = {
                body: {
                    email: 'test-emal@gmail.com',
                    password: 'testUserPass'
                }
            };
            const mRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            const userController = new userController_1.UserController(mConnection);
            yield userController.loginUser(mReq, mRes);
            expect(userService.login).toHaveBeenCalledTimes(1);
            expect(mRes.status).toBeCalledWith(400);
            expect(mRes.status().json).toBeCalledWith({
                success: false,
                message: 'Auth failed! Check your email.'
            });
        }));
        test('should return status 401 - email and password does not match', () => __awaiter(void 0, void 0, void 0, function* () {
            const mConnection = {
                execute(query, params) { }
            };
            const userService = new userService_1.UserService(mConnection);
            userService.login
                .mockResolvedValueOnce({
                id: '87ed8836-efaf-4dcf-baaa-d94e2358fc6b',
                name: 'Test User',
                email: 'test-email@gmail.com',
                password: '$2b$10$p/aOc7IChl53tL9rSJbM1.fMz2Nz62lkRG94YaULkBxbpey1zw7Uy'
            });
            const mReq = {
                body: {
                    email: 'test-email@gmail.com',
                    password: 'testUserPas'
                }
            };
            const mRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            const userController = new userController_1.UserController(mConnection);
            yield userController.loginUser(mReq, mRes);
            expect(userService.login).toHaveBeenCalledTimes(1);
            expect(mRes.status).toBeCalledWith(401);
            expect(mRes.status().json).toBeCalledWith({
                success: false,
                message: 'Email and password does not match.'
            });
        }));
    });
});
