import Ajv from 'ajv';
import userSchemaCreate from './user/new-user.json';
import userSchemaLogin from './user/user-login.json';
import empSchemaList from './employees/emp-all.json';
import empSchemaGetId from './employees/emp-id.json';
import empSchemaCreate from './employees/emp-create.json';

const ajv = Ajv({ allErrors: true, removeAdditional: 'all' });
ajv.addSchema(userSchemaCreate, 'new-user');
ajv.addSchema(userSchemaLogin, 'user-login');
ajv.addSchema(empSchemaList, 'emp-all');
ajv.addSchema(empSchemaGetId, 'emp-id');
ajv.addSchema(empSchemaCreate, 'emp-create');

function errorResponse(schemaErrors: any) {
  const errors = schemaErrors.map((error: any) => {
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

export const validateBody = (schemaName: any) => {
  return (req: any, res: any, next: any) => {
    const valid = ajv.validate(schemaName, req.body);
    if (!valid) {
      return res.status(400).send(errorResponse(ajv.errors));
    }
    next();
  };
};

export const validEmpList = (schemaName: any) => {
  return (req: any, res: any, next: any) => {
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

export const validEmpId = (schemaName: any) => {
  return (req: any, res: any, next: any) => {
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

