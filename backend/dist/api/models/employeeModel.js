"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Employee {
    constructor(empID = 0, empName = "", empActive = false, empDepartment = 0, creator = '') {
        this._empID = empID;
        this._empName = empName;
        this._empActive = empActive;
        this._empDepartment = empDepartment;
        this._creator = creator;
    }
    get empID() {
        return this._empID;
    }
    set empID(empID) {
        this._empID = empID;
    }
    get empName() {
        return this._empName;
    }
    set empName(empName) {
        this._empName = empName;
    }
    get empActive() {
        return this._empActive;
    }
    set empActive(empActive) {
        this._empActive = empActive;
    }
    get empDepartment() {
        return this._empDepartment;
    }
    set empDepartment(empDepartment) {
        this._empDepartment = empDepartment;
    }
    get creator() {
        return this._creator;
    }
    set creator(creator) {
        this._creator = creator;
    }
}
exports.Employee = Employee;
