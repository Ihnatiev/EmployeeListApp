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
const express_1 = __importDefault(require("express"));
const utils_1 = require("../utils");
const errorHandlers_1 = __importDefault(require("../middleware/errorHandlers"));
const routes_1 = __importDefault(require("../routes/routes"));
const middleware_1 = __importDefault(require("../middleware"));
const supertest_1 = __importDefault(require("supertest"));
describe("Routes", () => {
    let router;
    beforeEach(() => {
        router = express_1.default();
        utils_1.applyMiddleware(middleware_1.default, router);
        utils_1.applyRoutes(routes_1.default, router);
        utils_1.applyMiddleware(errorHandlers_1.default, router);
    });
    describe("Employees", () => {
        test("a valid string query for get all employees - return 200", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield supertest_1.default(router).get("/api/employees?pagesize=1&page=0");
            expect(response.status).toEqual(200);
            expect(response.body).toStrictEqual({
                "employees": [
                    {
                        "empID": 1,
                        "empName": "Lisa",
                        "creator": "f6f7dd58-0b07-494e-85d6-c0c03b902256",
                        "empActive": "Yes",
                        "dpName": "HR"
                    }
                ],
                "maxEmployees": 4
            });
        }));
        test("an invalid string query for get all employees - return 400", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield supertest_1.default(router).get("/api/employees?pagesize=1");
            expect(response.status).toEqual(400);
        }));
        test("a valid string query for get an employee - return 200", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield supertest_1.default(router).get("/api/employees/1");
            expect(response.status).toEqual(200);
            expect(response.body).toStrictEqual({
                "success": true,
                "employee": [
                    {
                        "empID": 1,
                        "empName": "Lisa",
                        "empActive": "Yes",
                        "dpName": "HR"
                    }
                ]
            });
        }));
        test("an invalid string query for get an employee - return 400", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield supertest_1.default(router).get("/api/employees/");
            expect(response.status).toEqual(400);
        }));
        describe("Requests without authentication to routes of employees", () => {
            const data = {
                "empName": "Test Rout",
                "empActive": true,
                "empDepartment": 1
            };
            test("try to post an employee without authentication - return 401", () => __awaiter(void 0, void 0, void 0, function* () {
                yield supertest_1.default(router)
                    .post("/api/employees/")
                    .send(data)
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .expect(401)
                    .expect({ message: 'You are not authenticated!' });
            }));
            test("try to update an employee without authentication - return 401", () => __awaiter(void 0, void 0, void 0, function* () {
                yield supertest_1.default(router)
                    .put("/api/employees/1")
                    .send(data)
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .expect(401)
                    .expect({ message: 'You are not authenticated!' });
            }));
            test("try to delete an employee without authentication - return 401", () => __awaiter(void 0, void 0, void 0, function* () {
                yield supertest_1.default(router)
                    .delete("/api/employees/1")
                    .expect(401)
                    .expect({ message: 'You are not authenticated!' });
            }));
        });
        describe("Request with authentication to routes of employees", () => {
            let token;
            let employeeId;
            beforeAll((done) => {
                router = express_1.default();
                utils_1.applyMiddleware(middleware_1.default, router);
                utils_1.applyRoutes(routes_1.default, router);
                utils_1.applyMiddleware(errorHandlers_1.default, router);
                const userLog = {
                    "email": "testUser@test.com",
                    "password": "superPassword"
                };
                supertest_1.default(router)
                    .post("/api/auth/login")
                    .send(userLog)
                    .set('Accept', 'application/json')
                    .end((err, response) => {
                    token = response.body.token; // save the token!
                    done();
                });
            });
            const data = {
                "empName": "Test Emp",
                "empActive": true,
                "empDepartment": 1 //HR
            };
            test("Create an employee", () => __awaiter(void 0, void 0, void 0, function* () {
                yield supertest_1.default(router)
                    .post("/api/employees/")
                    .send(data)
                    .set('Authorization', `Bearer ${token}`)
                    .expect('Content-Type', /json/)
                    .then((response) => {
                    expect(response.status).toEqual(201);
                    employeeId = response.body.employee;
                });
            }));
            test('Get an employee', () => __awaiter(void 0, void 0, void 0, function* () {
                yield supertest_1.default(router)
                    .get('/api/employees/' + employeeId)
                    .then((response) => {
                    expect(response.status).toBe(200);
                });
            }));
            test('Update an employee', () => __awaiter(void 0, void 0, void 0, function* () {
                yield supertest_1.default(router)
                    .put('/api/employees/' + employeeId)
                    .send({
                    empName: 'Test Emp',
                    empActive: false,
                    empDepartment: 1 // HR
                })
                    .set('Authorization', `Bearer ${token}`)
                    .then((response) => {
                    expect(response.status).toBe(200);
                });
            }));
            test('Delete an employee', () => __awaiter(void 0, void 0, void 0, function* () {
                yield supertest_1.default(router)
                    .delete('/api/employees/' + employeeId)
                    .set('Authorization', `Bearer ${token}`)
                    .then((response) => {
                    expect(response.status).toBe(200);
                });
            }));
        });
    });
    describe("Users", () => {
        test.skip("signup user - return 201", () => __awaiter(void 0, void 0, void 0, function* () {
            const user = {
                "name": "Test User",
                "email": "testUser@test.com",
                "password": "superPassword"
            };
            yield supertest_1.default(router)
                .post("/api/auth/signup")
                .send(user)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(201);
        }));
        test("signup user - return 500", () => __awaiter(void 0, void 0, void 0, function* () {
            const user = {
                "name": "Test User",
                "email": "testUser@test.com",
                "password": "superPassword"
            };
            yield supertest_1.default(router)
                .post("/api/auth/signup")
                .send(user)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(500)
                .expect({ success: false, message: 'Sorry. That email already exists. Try again.' });
        }));
        test("login user - return 200", () => __awaiter(void 0, void 0, void 0, function* () {
            const userLog = {
                "email": "testUser@test.com",
                "password": "superPassword"
            };
            yield supertest_1.default(router)
                .post("/api/auth/login")
                .send(userLog)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200);
        }));
        test("login user - return 400", () => __awaiter(void 0, void 0, void 0, function* () {
            const userLog = {
                "email": "test@test.com",
                "password": "superPassword"
            };
            yield supertest_1.default(router)
                .post("/api/auth/login")
                .send(userLog)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400)
                .expect({ success: false, message: 'Auth failed! Check your email.' });
        }));
        test("login user - return 401", () => __awaiter(void 0, void 0, void 0, function* () {
            const userLog = {
                "email": "testUser@test.com",
                "password": "superPass"
            };
            yield supertest_1.default(router)
                .post("/api/auth/login")
                .send(userLog)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(401)
                .expect({ success: false, message: 'Email and password does not match.' });
        }));
    });
});
