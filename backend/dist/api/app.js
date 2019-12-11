"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql_1 = __importDefault(require("mysql"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const util_1 = __importDefault(require("util"));
const DBkeys_1 = __importDefault(require("./config/DBkeys"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_json_1 = __importDefault(require("./swagger/swagger.json"));
const IDBconnection_1 = require("./config/IDBconnection");
const app = express_1.default();
class MysqlConnection extends IDBconnection_1.IDBConnection {
    constructor() {
        super();
        dotenv_1.default.config();
        this.pool = mysql_1.default.createPool({
            host: DBkeys_1.default.database.host,
            user: DBkeys_1.default.database.user,
            password: DBkeys_1.default.database.password,
            multipleStatements: true
        });
        this.pool.query = util_1.default.promisify(this.pool.query);
        this.pool.query('SHOW SCHEMA LIKE ' + DBkeys_1.default.database.databaseName, (err, result) => {
            if (err) {
                const createDatabase = `CREATE SCHEMA IF NOT EXISTS EmployeeDB`;
                // tslint:disable-next-line: no-shadowed-variable
                this.pool.query(createDatabase, (err, result) => {
                    if (err) {
                        console.log('createDatabase error:\n' + err);
                    }
                    else {
                        console.log('Connected to Database');
                    }
                });
            }
        });
        this.pool.query('SHOW TABLES LIKE EmployeeDB.Users', (err, result) => {
            if (err) {
                const createUsersTable = `CREATE TABLE IF NOT EXISTS EmployeeDB.Users(
                id varchar(150) primary key,
                name varchar(45) not null,
                email varchar(45) not null unique,
                password varchar(225) not null);
                INSERT INTO EmployeeDB.users (id, name, email, password) VALUES (
                "f6f7dd58-0b07-494e-85d6-c0c03b902256", "Test User", "testUser@test.com",
                "$2b$10$8UbnMHU9mvmwzyNKl/kCFeG3yBA1MOEiBProvq98.aBEPGWdxVnJC");`;
                // tslint:disable-next-line: no-shadowed-variable
                this.pool.query(createUsersTable, (err, result) => {
                    if (err) {
                        // console.log('createUsersTable error:\n' + err);
                    }
                    else {
                        // console.log('Connected to Users');
                    }
                });
            }
        });
        this.pool.query('SHOW TABLES LIKE EmployeeDB.Departments', (err, result) => {
            if (err) {
                const createDepartmentsTable = `CREATE TABLE IF NOT EXISTS EmployeeDB.Departments(
                dpID int(11) NOT NULL Primary Key,
                dpName varchar(45) not null);
              INSERT INTO EmployeeDB.departments (dpID, dpName) VALUES (1, "HR");
              INSERT INTO EmployeeDB.departments (dpID, dpName) VALUES (2, "Tech");
              INSERT INTO EmployeeDB.departments (dpID, dpName) VALUES (3, "Finance");`;
                // tslint:disable-next-line: no-shadowed-variable
                this.pool.query(createDepartmentsTable, (err, result) => {
                    if (err) {
                        // console.log('createDepartmentsTable error:\n' + err);
                    }
                    else {
                        // console.log('Connected to Departments');
                    }
                });
            }
        });
        this.pool.query('SHOW TABLES LIKE EmployeeDB.Employees', (err, result) => {
            if (err) {
                const createEmployeesTable = `CREATE TABLE IF NOT EXISTS EmployeeDB.Employees(
                empID int(11) auto_increment NOT NULL Primary Key,
                empName varchar(45) not null,
                empActive tinyint(1) not null,
                empDepartment int(11) not null,
                creator varchar(45) not null,
                CONSTRAINT fk_empDepartment FOREIGN KEY (empDepartment)
                REFERENCES departments(dpID));
              INSERT INTO EmployeeDB.employees (empID, empName, empActive, empDepartment, creator)
              VALUES (1, "Lisa", true, 1, "f6f7dd58-0b07-494e-85d6-c0c03b902256");
              INSERT INTO EmployeeDB.employees (empID, empName, empActive, empDepartment, creator)
              VALUES (2, "Bart", false, 2, "f6f7dd58-0b07-494e-85d6-c0c03b902256");
              INSERT INTO EmployeeDB.employees (empID, empName, empActive, empDepartment, creator)
              VALUES (3, "Tina", false, 2, "f6f7dd58-0b07-494e-85d6-c0c03b902256");
              INSERT INTO EmployeeDB.employees (empID, empName, empActive, empDepartment, creator)
              VALUES (4, "Homer", true, 3, "f6f7dd58-0b07-494e-85d6-c0c03b902256");`;
                // tslint:disable-next-line: no-shadowed-variable
                this.pool.query(createEmployeesTable, (err, result) => {
                    if (err) {
                        // console.log('createEmployeesTable error:\n' + err);
                    }
                    else {
                        // console.log('Connected to Employees');
                    }
                });
            }
        });
    }
    execute(query, params = null) {
        if (params !== null) {
            return this.pool.query(query, params);
        }
        else {
            return this.pool.query(query);
        }
    }
}
exports.MysqlConnection = MysqlConnection;
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_json_1.default));
exports.default = app;
