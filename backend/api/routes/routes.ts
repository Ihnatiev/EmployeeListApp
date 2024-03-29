import { Request, Response } from 'express';
import { validateBody, validEmpList, validEmpId } from '../swagger/valid';
import { checkUserCreate, checkUserLogin } from '../middleware/checks';
import { EmployeesController } from '../controllers/employeeController';
import { UserController } from '../controllers/userController';
import { checkJwt } from '../middleware/check-auth';
import { MysqlConnection } from '../config/MysqlConnection';

const mysqlConnection: MysqlConnection = new MysqlConnection();
const employeesController: EmployeesController = new EmployeesController(mysqlConnection);
const userController: UserController = new UserController(mysqlConnection);

export default [
  {
    path: '/api/auth/signup',
    method: 'post',
    handler: [validateBody('new-user'), checkUserCreate,
    async (req: Request, res: Response) => {
      await userController.createUser(req, res);
    }]
  },
  {
    path: '/api/auth/login',
    method: 'post',
    handler: [validateBody('user-login'), checkUserLogin,
    async (req: Request, res: Response) => {
      await userController.loginUser(req, res);
    }]
  },
  {
    path: '/api/employees',
    method: 'get',
    handler: [validEmpList('emp-all'),
    async (req: Request, res: Response) => {
      await employeesController.findAllEmployees(req, res);

    }]
  },
  {
    path: '/api/employees/:empID',
    method: 'get',
    handler: [validEmpId('emp-id'),
    async (req: Request, res: Response) => {
      await employeesController.findEmployee(req, res);
    }]
  },
  {
    path: '/api/employees/',
    method: 'post',
    handler: [checkJwt,
    async (req: Request, res: Response) => {
      await employeesController.createEmployee(req, res);
    }]
  },
  {
    path: '/api/employees/:empID',
    method: 'put',
    handler: [validateBody('emp-create'), checkJwt,
    async (req: Request, res: Response) => {
      await employeesController.updateEmployee(req, res);
    }]
  },
  {
    path: '/api/employees/:empID',
    method: 'delete',
    handler: [validEmpId('emp-id'), checkJwt,
    async (req: Request, res: Response) => {
      await employeesController.deleteEmployee(req, res);
    }]
  }
];

