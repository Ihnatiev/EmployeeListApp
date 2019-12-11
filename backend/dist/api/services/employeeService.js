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
const employeeModel_1 = require("../models/employeeModel");
class EmployeesService {
    constructor(connection) {
        this.connection = connection;
    }
    find(empID) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryResult = yield this.connection.execute("SELECT empID, empName, IF (empActive, 'Yes', 'No')\
      empActive, dpName FROM EmployeeDB.Employees NNER JOIN EmployeeDB.Departments\
      ON empDepartment = dpID WHERE empID = ?", empID);
            const e = queryResult[0];
            return e;
        });
    }
    findCount() {
        return __awaiter(this, void 0, void 0, function* () {
            const results = yield this.connection.execute('SELECT count(*) as totalCount FROM EmployeeDB.Employees');
            return results;
        });
    }
    findAll(numPerPage, page) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = page * numPerPage;
            const end_limit = numPerPage;
            const limit = skip + ',' + end_limit;
            const queryResults = yield this.connection.execute("SELECT empID, empName, creator, IF (empActive, 'Yes', 'No')\
    empActive, dpName FROM EmployeeDB.Employees\
    INNER JOIN EmployeeDB.Departments ON empDepartment = dpID ORDER BY empID LIMIT " + limit);
            let results = [];
            results = queryResults.map((m) => {
                return m;
            });
            return results;
        });
    }
    create(empName, empActive, empDepartment, creator) {
        return __awaiter(this, void 0, void 0, function* () {
            const employee = new employeeModel_1.Employee();
            employee.empName = empName;
            employee.empActive = empActive;
            employee.empDepartment = empDepartment;
            employee.creator = creator;
            const result = yield this.connection.execute("INSERT INTO EmployeeDB.Employees SET empName = ?, empActive = ?, empDepartment = ?, creator = ?", [
                employee.empName,
                employee.empActive,
                employee.empDepartment,
                employee.creator
            ]);
            employee.empID = result.insertId;
            return employee;
        });
    }
    update(empID, empName, empActive, empDepartment, creator) {
        return __awaiter(this, void 0, void 0, function* () {
            const employee = yield this.find(empID);
            employee.empName = empName;
            employee.empActive = empActive;
            employee.empDepartment = empDepartment;
            employee.creator = creator;
            const result = yield this.connection.execute("UPDATE EmployeeDB.Employees SET empName = ?, empActive = ?, empDepartment = ? WHERE empID = ? AND creator = ?", [
                employee.empName,
                employee.empActive,
                employee.empDepartment,
                employee.empID,
                creator
            ]);
            return result;
        });
    }
    delete(empID, creator) {
        return __awaiter(this, void 0, void 0, function* () {
            const employee = yield this.find(empID);
            const result = yield this.connection.execute("DELETE FROM EmployeeDB.Employees WHERE empID = ? AND creator = ?", [employee.empID, creator]);
            return result;
        });
    }
}
exports.EmployeesService = EmployeesService;
