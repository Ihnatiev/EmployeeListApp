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
const employeeController_1 = require("../../../controllers/employeeController");
const employeeService_1 = require("../../../services/employeeService");
jest.mock('../../../services/employeeService', () => {
    const mEmployeesService = {
        findCount: jest.fn(),
        findAll: jest.fn(),
        find: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        create: jest.fn()
    };
    return { EmployeesService: jest.fn(() => mEmployeesService) };
});
describe('Employees', () => {
    describe('Get request for all employees', () => {
        afterEach(() => {
            jest.clearAllMocks();
        });
        test('should return status 200 - get all employees', () => __awaiter(void 0, void 0, void 0, function* () {
            const mConnection = {
                execute(query, params) { }
            };
            const expectedEmp = {
                empID: 1,
                empName: 'Lisa',
                empActive: 'Yes',
                empDepartment: 'HR',
                creator: '48850418-bb67-489d-a391-575bcb110ed5'
            };
            const employeeService = new employeeService_1.EmployeesService(mConnection);
            employeeService.findCount
                .mockResolvedValueOnce([{ totalCount: 5 }]);
            employeeService.findAll
                .mockResolvedValueOnce([expectedEmp]);
            const mReq = {
                query: { pagesize: 1, page: 0 }
            };
            const mRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            const employeesController = new employeeController_1.EmployeesController(mConnection);
            yield employeesController.findAllEmployees(mReq, mRes);
            expect(employeeService.findCount).toHaveBeenCalledTimes(1);
            expect(employeeService.findAll).toHaveBeenCalledTimes(1);
            expect(employeeService.findAll).toBeCalledWith(1, 0);
            expect(mRes.status).toBeCalledWith(200);
            expect(mRes.status().json).toBeCalledWith({ employees: [expectedEmp], maxEmployees: 5 });
        }));
        test('should return status 400 - bad query', () => __awaiter(void 0, void 0, void 0, function* () {
            const mConnection = {
                execute(query, params) { }
            };
            const employeeService = new employeeService_1.EmployeesService(mConnection);
            employeeService.findCount
                .mockResolvedValueOnce([{ totalCount: 0 }]);
            employeeService.findAll
                .mockResolvedValueOnce([]);
            const mReq = {
                query: {
                    pagesize: 1,
                    page: 0
                }
            };
            const mRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            const employeesController = new employeeController_1.EmployeesController(mConnection);
            yield employeesController.findAllEmployees(mReq, mRes);
            expect(employeeService.findCount).toHaveBeenCalledTimes(1);
            expect(employeeService.findAll).toHaveBeenCalledTimes(1);
            expect(employeeService.findAll).toBeCalledWith(1, 0);
            expect(mRes.status).toBeCalledWith(404);
            expect(mRes.status().json).toBeCalledWith({ success: false, message: 'Employee not found' });
        }));
        test('should return status 400 - server error (bad query)', () => __awaiter(void 0, void 0, void 0, function* () {
            const mConnection = {
                execute(query, params) { }
            };
            const employeeService = new employeeService_1.EmployeesService(mConnection);
            employeeService.findCount
                .mockResolvedValueOnce();
            employeeService.findAll
                .mockResolvedValueOnce();
            const mReq = {
                query: { pagesize: 1 }
            };
            const mRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            const employeesController = new employeeController_1.EmployeesController(mConnection);
            yield employeesController.findAllEmployees(mReq, mRes);
            expect(employeeService.findCount).toHaveBeenCalledTimes(1);
            expect(employeeService.findAll).toHaveBeenCalledTimes(1);
            expect(mRes.status).toBeCalledWith(400);
            expect(mRes.status().json).toBeCalledWith({ success: false, message: 'Server error' });
        }));
    });
    describe('Get request for an employee', () => {
        afterEach(() => {
            jest.clearAllMocks();
        });
        test('should return status 200 - get an employee', () => __awaiter(void 0, void 0, void 0, function* () {
            const mConnection = {
                execute(query, params) { }
            };
            const expectedEmp = {
                empID: 1,
                empName: 'Lisa',
                empActive: 'Yes',
                empDepartment: 'HR'
            };
            const employeeService = new employeeService_1.EmployeesService(mConnection);
            employeeService.find
                .mockResolvedValueOnce(expectedEmp);
            const mReq = {
                params: { empID: 1 }
            };
            const mRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            const employeesController = new employeeController_1.EmployeesController(mConnection);
            yield employeesController.findEmployee(mReq, mRes);
            expect(employeeService.find).toHaveBeenCalledTimes(1);
            expect(mRes.status).toBeCalledWith(200);
            expect(mRes.status().json).toBeCalledWith({ success: true, employee: [expectedEmp] });
        }));
        test('should return status 404 - employee not found', () => __awaiter(void 0, void 0, void 0, function* () {
            const mConnection = {
                execute(query, params) { }
            };
            const employeeService = new employeeService_1.EmployeesService(mConnection);
            employeeService.find
                .mockResolvedValueOnce(undefined);
            const mReq = {
                params: { empID: 111 }
            };
            const mRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            const employeesController = new employeeController_1.EmployeesController(mConnection);
            yield employeesController.findEmployee(mReq, mRes);
            expect(employeeService.find).toHaveBeenCalledTimes(1);
            expect(mRes.status).toBeCalledWith(404);
            expect(mRes.status().json).toBeCalledWith({ success: false, message: 'Employee not found!' });
        }));
        test('should return status 500 - server erorr', () => __awaiter(void 0, void 0, void 0, function* () {
            const mConnection = {
                execute(query, params) { }
            };
            const mReq = {};
            const mRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            const employeesController = new employeeController_1.EmployeesController(mConnection);
            yield employeesController.findEmployee(mReq, mRes);
            expect(mRes.status).toBeCalledWith(500);
            expect(mRes.status().json).toBeCalledWith({ success: false, message: 'Server error' });
        }));
    });
    describe('Put request for an employee', () => {
        afterEach(() => {
            jest.clearAllMocks();
        });
        test('should return status 200 - update an employee', () => __awaiter(void 0, void 0, void 0, function* () {
            const mConnection = {
                execute(query, params) { }
            };
            const employeeService = new employeeService_1.EmployeesService(mConnection);
            employeeService.update
                .mockResolvedValueOnce({ affectedRows: 1 });
            const mReq = {
                params: { empID: 1 },
                userData: { userId: '48850418-bb67-489d-a391-575bcb110ed5' },
                body: { empName: 'Lisa', empActive: 'No', empDepartment: 'Tech' }
            };
            const mRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            const employeesController = new employeeController_1.EmployeesController(mConnection);
            yield employeesController.updateEmployee(mReq, mRes);
            expect(employeeService.update).toHaveBeenCalledTimes(1);
            expect(mRes.status).toBeCalledWith(200);
            expect(mRes.status().json).toBeCalledWith({ success: true, message: 'Update successfully!' });
        }));
        test('should return status 401 - unauthorized', () => __awaiter(void 0, void 0, void 0, function* () {
            const mConnection = {
                execute(query, params) { }
            };
            const employeeService = new employeeService_1.EmployeesService(mConnection);
            employeeService.update
                .mockResolvedValueOnce({ affectedRows: 0 });
            const mReq = {
                params: { empID: 1 },
                userData: { userId: '41492418-ba65-439y-a168-5itd79zvdf' },
                body: { empName: 'Lisa', empActive: 'No', empDepartment: 'Tech' }
            };
            const mRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            const employeesController = new employeeController_1.EmployeesController(mConnection);
            yield employeesController.updateEmployee(mReq, mRes);
            expect(employeeService.update).toHaveBeenCalledTimes(1);
            expect(mRes.status).toBeCalledWith(401);
            expect(mRes.status().json).toBeCalledWith({ success: false, message: 'You are not authorized!' });
        }));
        test('should return status 500 - updating an employee failed', () => __awaiter(void 0, void 0, void 0, function* () {
            const mConnection = {
                execute(query, params) { }
            };
            const employeeService = new employeeService_1.EmployeesService(mConnection);
            employeeService.update
                .mockResolvedValueOnce(undefined);
            const mReq = {
                params: { empID: 1 },
                userData: { userId: '48850418-bb67-489d-a391-575bcb110ed5' },
                body: { empActive: 'No', empDepartment: 'Tech' }
            };
            const mRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            const employeesController = new employeeController_1.EmployeesController(mConnection);
            yield employeesController.updateEmployee(mReq, mRes);
            expect(employeeService.update).toHaveBeenCalledTimes(1);
            expect(mRes.status).toBeCalledWith(500);
            expect(mRes.status().json).toBeCalledWith({ success: false, message: 'Updating an employee failed!' });
        }));
    });
    describe('Delete request for an employee', () => {
        afterEach(() => {
            jest.clearAllMocks();
        });
        test('should return status 200 - deleting an employee successful', () => __awaiter(void 0, void 0, void 0, function* () {
            const mConnection = {
                execute(query, params) { }
            };
            const employeeService = new employeeService_1.EmployeesService(mConnection);
            employeeService.delete
                .mockResolvedValueOnce({ affectedRows: 1 });
            const mReq = {
                params: { empID: 1 },
                userData: { userId: '48850418-bb67-489d-a391-575bcb110ed5' },
                body: { empName: 'Lisa', empActive: 'No', empDepartment: 'Tech' }
            };
            const mRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            const employeesController = new employeeController_1.EmployeesController(mConnection);
            yield employeesController.deleteEmployee(mReq, mRes);
            expect(employeeService.delete).toHaveBeenCalledTimes(1);
            expect(mRes.status).toBeCalledWith(200);
            expect(mRes.status().json).toBeCalledWith({ success: true, message: 'Deletion successful!' });
        }));
        test('should return status 401 - unauthorized', () => __awaiter(void 0, void 0, void 0, function* () {
            const mConnection = {
                execute(query, params) { }
            };
            const employeeService = new employeeService_1.EmployeesService(mConnection);
            employeeService.delete
                .mockResolvedValueOnce([]);
            const mReq = {
                params: { empID: 1 },
                userData: { userId: '41492418-ba65-439y-a168-5itd79zvdf' }
            };
            const mRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            const employeesController = new employeeController_1.EmployeesController(mConnection);
            yield employeesController.deleteEmployee(mReq, mRes);
            expect(employeeService.delete).toHaveBeenCalledTimes(1);
            expect(mRes.status).toBeCalledWith(401);
            expect(mRes.status().json).toBeCalledWith({ success: false, message: 'You are not authorized!' });
        }));
        test('should return status 500 - deleting an employee failed', () => __awaiter(void 0, void 0, void 0, function* () {
            const mConnection = {
                execute(query, params) { }
            };
            const employeeService = new employeeService_1.EmployeesService(mConnection);
            employeeService.delete
                .mockResolvedValueOnce();
            const mReq = {
                params: {},
                userData: {}
            };
            const mRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            const employeesController = new employeeController_1.EmployeesController(mConnection);
            yield employeesController.deleteEmployee(mReq, mRes);
            expect(employeeService.delete).toHaveBeenCalledTimes(1);
            expect(mRes.status).toBeCalledWith(500);
            expect(mRes.status().json).toBeCalledWith({ success: false, message: 'Deleting an employee failed!' });
        }));
    });
    describe('Post request for an employee', () => {
        afterEach(() => {
            jest.clearAllMocks();
        });
        test('should return status 201 - employee added', () => __awaiter(void 0, void 0, void 0, function* () {
            const mConnection = {
                execute(query, params) { }
            };
            const employeeService = new employeeService_1.EmployeesService(mConnection);
            employeeService.create
                .mockResolvedValueOnce({
                empID: 6,
                empName: 'Max',
                empActive: true,
                empDepartment: 'Tech',
                creator: '48850418-bb67-489d-a391-575bcb110ed5'
            });
            const mReq = {
                userData: { userId: '48850418-bb67-489d-a391-575bcb110ed5' },
                body: { empName: 'Max', empActive: true, empDepartment: 'Tech' }
            };
            const mRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            const employeesController = new employeeController_1.EmployeesController(mConnection);
            yield employeesController.createEmployee(mReq, mRes);
            expect(employeeService.create).toHaveBeenCalledTimes(1);
            expect(mRes.status).toBeCalledWith(201);
            expect(mRes.status().json).toBeCalledWith({
                success: true,
                message: 'Employee added successfully!',
                employee: 6
            });
        }));
        test('should return status 500 - adding employee failed', () => __awaiter(void 0, void 0, void 0, function* () {
            const mConnection = {
                execute(query, params) { }
            };
            const employeeService = new employeeService_1.EmployeesService(mConnection);
            employeeService.create
                .mockResolvedValueOnce();
            const mReq = {
                userData: { userId: '48850418-bb67-489d-a391-575bcb110ed5' },
                body: { empActive: true, empDepartment: 'Tech' }
            };
            const mRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            const employeesController = new employeeController_1.EmployeesController(mConnection);
            yield employeesController.createEmployee(mReq, mRes);
            expect(employeeService.create).toHaveBeenCalledTimes(1);
            expect(mRes.status).toBeCalledWith(500);
            expect(mRes.status().json).toBeCalledWith({ success: false, message: 'Adding employee failed!' });
        }));
    });
});
