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
const employeeService_1 = require("../services/employeeService");
class EmployeesController {
    constructor(dbConnection) {
        this.employeeService = new employeeService_1.EmployeesService(dbConnection);
    }
    findEmployee(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const empID = req.params.empID;
                const employee = yield this.employeeService.find(empID);
                (employee) ?
                    res.status(200).json({
                        success: true,
                        employee: [employee]
                    }) :
                    res.status(404).json({
                        success: false,
                        message: 'Employee not found!'
                    });
            }
            catch (err) {
                res.status(500).json({
                    success: false,
                    message: 'Server error'
                });
            }
            ;
        });
    }
    findAllEmployees(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const numPerPage = +req.query.pagesize;
                const page = +req.query.page;
                const count = yield this.employeeService.findCount();
                const results = yield this.employeeService.findAll(numPerPage, page);
                const totalEmployee = count[0].totalCount;
                if (totalEmployee === 0) {
                    return res.status(404).json({
                        success: false,
                        message: 'Employee not found'
                    });
                }
                else if (count && results) {
                    return res.status(200).json({
                        employees: results,
                        maxEmployees: totalEmployee
                    });
                }
                ;
            }
            catch (_a) {
                res.status(400).json({
                    success: false,
                    message: 'Server error'
                });
            }
            ;
        });
    }
    createEmployee(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { empName, empActive, empDepartment } = req.body;
            const creator = req.userData.userId;
            try {
                const result = yield this.employeeService
                    .create(empName, empActive, empDepartment, creator);
                return res.status(201).json({
                    success: true,
                    message: 'Employee added successfully!',
                    employee: result.empID
                });
            }
            catch (err) {
                res.status(500).json({
                    success: false,
                    message: 'Adding employee failed!'
                });
            }
            ;
        });
    }
    updateEmployee(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const empID = req.params.empID;
            const creator = req.userData.userId;
            const { empName, empActive, empDepartment } = req.body;
            yield this.employeeService
                .update(empID, empName, empActive, empDepartment, creator)
                .then((result) => {
                (result.affectedRows > 0) ?
                    res.status(200).json({
                        success: true,
                        message: 'Update successfully!'
                    }) :
                    res.status(401).json({
                        success: false,
                        message: 'You are not authorized!'
                    });
            }).catch(err => {
                res.status(500).json({
                    success: false,
                    message: "Updating an employee failed!"
                });
            });
        });
    }
    deleteEmployee(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const empID = req.params.empID;
            const creator = req.userData.userId;
            yield this.employeeService.delete(empID, creator)
                .then((employee) => {
                (employee.affectedRows > 0) ?
                    res.status(200).json({
                        success: true,
                        message: 'Deletion successful!'
                    }) :
                    res.status(401).json({
                        success: false,
                        message: 'You are not authorized!'
                    });
            }).catch(err => {
                res.status(500).json({
                    success: false,
                    message: 'Deleting an employee failed!'
                });
            });
        });
    }
}
exports.EmployeesController = EmployeesController;
