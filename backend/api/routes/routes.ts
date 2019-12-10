import { Request, Response } from 'express';
import { validateBody, validEmpList, validEmpId } from '../swagger/valid';
import { checkUserCreate, checkUserLogin } from '../middleware/checks';
import { EmployeesController } from '../controllers/employeeController';
import { UserController } from '../controllers/userController';
import { checkJwt } from '../middleware/check-auth';
import { MysqlConnection } from '../app';

const mysqlConnection = new MysqlConnection();
const employeesController = new EmployeesController(mysqlConnection);
const userController = new UserController(mysqlConnection);

export default [
  {
    path: "/api/auth/signup",
    method: "post",
    handler: [validateBody('new-user'), checkUserCreate,
    (req: Request, res: Response) => {
      userController.createUser(req, res);
    }]
  },
  {
    path: "/api/auth/login",
    method: "post",
    handler: [validateBody('user-login'), checkUserLogin,
    async (req: Request, res: Response) => {
      await userController.loginUser(req, res);
    }]
  },
  {
    path: "/api/employees",
    method: "get",
    handler: [validEmpList('emp-all'),
    async (req: Request, res: Response) => {
      await employeesController.findAllEmployees(req, res);

    }]
  },
  {
    path: "/api/employees/:empID",
    method: "get",
    handler: [validEmpId('emp-id'),
    async (req: Request, res: Response) => {
      await employeesController.findEmployee(req, res);
    }]
  },
  {
    path: "/api/employees/",
    method: "post",
    handler: [validateBody('emp-create'), checkJwt,
    async (req: Request, res: Response) => {
      await employeesController.createEmployee(req, res);
    }]
  },
  {
    path: "/api/employees/:empID",
    method: "put",
    handler: [validEmpId('emp-id'), validateBody('emp-create'), checkJwt,
    async (req: Request, res: Response) => {
      await employeesController.updateEmployee(req, res);
    }]
  },
  {
    path: "/api/employees/:empID",
    method: "delete",
    handler: [validEmpId('emp-id'), checkJwt,
    async (req: Request, res: Response) => {
      await employeesController.deleteEmployee(req, res);
    }]
  }
]

