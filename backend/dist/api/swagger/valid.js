"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ajv_1 = __importDefault(require("ajv"));
const new_user_json_1 = __importDefault(require("./user/new-user.json"));
const user_login_json_1 = __importDefault(require("./user/user-login.json"));
const emp_all_json_1 = __importDefault(require("./employees/emp-all.json"));
const emp_id_json_1 = __importDefault(require("./employees/emp-id.json"));
const emp_create_json_1 = __importDefault(require("./employees/emp-create.json"));
const ajv = ajv_1.default({ allErrors: true, removeAdditional: 'all' });
ajv.addSchema(new_user_json_1.default, 'new-user');
ajv.addSchema(user_login_json_1.default, 'user-login');
ajv.addSchema(emp_all_json_1.default, 'emp-all');
ajv.addSchema(emp_id_json_1.default, 'emp-id');
ajv.addSchema(emp_create_json_1.default, 'emp-create');
function errorResponse(schemaErrors) {
    const errors = schemaErrors.map((error) => {
        return {
            path: error.dataPath,
            message: error.message
        };
    });
    return {
        status: 'failed',
        error: errors
    };
}
exports.validateBody = (schemaName) => {
    return (req, res, next) => {
        const valid = ajv.validate(schemaName, req.body);
        if (!valid) {
            return res.status(400).send(errorResponse(ajv.errors));
        }
        next();
    };
};
exports.validEmpList = (schemaName) => {
    return (req, res, next) => {
        const pageSize = +req.query.pagesize;
        const pagE = +req.query.page;
        const pagination = {
            pagesize: pageSize,
            page: pagE
        };
        const valid = ajv.validate(schemaName, pagination);
        if (!valid) {
            return res.status(400).send(errorResponse(ajv.errors));
        }
        next();
    };
};
exports.validEmpId = (schemaName) => {
    return (req, res, next) => {
        const empId = +req.params.empID;
        const params = {
            empID: empId
        };
        const valid = ajv.validate(schemaName, params);
        if (!valid) {
            return res.status(400).send(errorResponse(ajv.errors));
        }
        next();
    };
};
