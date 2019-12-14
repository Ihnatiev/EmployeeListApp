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
const valid_1 = require("../swagger/valid");
const checks_1 = require("../middleware/checks");
const employeeController_1 = require("../controllers/employeeController");
const userController_1 = require("../controllers/userController");
const check_auth_1 = require("../middleware/check-auth");
const app_1 = require("../app");
const mysqlConnection = new app_1.MysqlConnection();
const employeesController = new employeeController_1.EmployeesController(mysqlConnection);
const userController = new userController_1.UserController(mysqlConnection);
exports.default = [
    {
        path: '/api/auth/signup',
        method: 'post',
        handler: [valid_1.validateBody('new-user'), checks_1.checkUserCreate,
            (req, res) => {
                userController.createUser(req, res);
            }]
    },
    {
        path: '/api/auth/login',
        method: 'post',
        handler: [valid_1.validateBody('user-login'), checks_1.checkUserLogin,
            (req, res) => __awaiter(void 0, void 0, void 0, function* () {
                yield userController.loginUser(req, res);
            })]
    },
    {
        path: '/api/employees',
        method: 'get',
        handler: [valid_1.validEmpList('emp-all'),
            (req, res) => __awaiter(void 0, void 0, void 0, function* () {
                yield employeesController.findAllEmployees(req, res);
            })]
    },
    {
        path: '/api/employees/:empID',
        method: 'get',
        handler: [valid_1.validEmpId('emp-id'),
            (req, res) => __awaiter(void 0, void 0, void 0, function* () {
                yield employeesController.findEmployee(req, res);
            })]
    },
    {
        path: '/api/employees/',
        method: 'post',
        handler: [valid_1.validateBody('emp-create'), check_auth_1.checkJwt,
            (req, res) => __awaiter(void 0, void 0, void 0, function* () {
                yield employeesController.createEmployee(req, res);
            })]
    },
    {
        path: '/api/employees/:empID',
        method: 'put',
        handler: [valid_1.validateBody('emp-create'), check_auth_1.checkJwt,
            (req, res) => __awaiter(void 0, void 0, void 0, function* () {
                yield employeesController.updateEmployee(req, res);
            })]
    },
    {
        path: '/api/employees/:empID',
        method: 'delete',
        handler: [valid_1.validEmpId('emp-id'), check_auth_1.checkJwt,
            (req, res) => __awaiter(void 0, void 0, void 0, function* () {
                yield employeesController.deleteEmployee(req, res);
            })]
    }
];
