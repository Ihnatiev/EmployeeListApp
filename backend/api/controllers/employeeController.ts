import { EmployeesService } from '../services/employeeService';
import { IDBConnection } from '../config/IDBConnection';
import { Employee } from '../models/employeeModel';

export class EmployeesController {
  private employeeService: EmployeesService;

  constructor(dbConnection: IDBConnection) {
    this.employeeService = new EmployeesService(dbConnection);
  }

  async findEmployee(req: any, res: any) {
    try {
      const empID: number = req.params.empID;
      const employee: Employee = await this.employeeService.find(empID);

      if (employee) {
        return res.status(200).json({
          success: true,
          employee: [employee]
        });
      }

      if (!employee) {
        return res.status(404).json({
          success: false,
          message: 'Employee not found!'
        });
      }
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  }

  async findAllEmployees(req: any, res: any) {
    try {
      const numPerPage: number = +req.query.pagesize;
      const page: number = +req.query.page;
      const count: any = await this.employeeService.findCount();
      const results: any[] = await this.employeeService.findAll(numPerPage, page);
      const totalEmployee: number = count[0].totalCount;

      if (totalEmployee === 0) {
        return res.status(404).json({
          success: false,
          message: 'Employee not found'
        });
      } else if (count && results) {
        return res.status(200).json({
          employees: results,
          maxEmployees: totalEmployee
        });
      }
    } catch {
      return res.status(400).json({
        success: false,
        message: 'Server error'
      });
    }
  }

  public async createEmployee(req: any, res: any) {
    const { empName, empActive, empDepartment } = req.body;
    const creator: string = req.userData.userId;

    try {
      const result: Employee = await this.employeeService
        .create(empName, empActive, empDepartment, creator);

      return res.status(201).json({
        success: true,
        message: 'Employee added successfully!',
        employee: result.empID
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: 'Adding employee failed!'
      });
    }
  }

  async updateEmployee(req: any, res: any) {
    const empID: number = req.params.empID;
    const creator: string = req.userData.userId;
    const { empName, empActive, empDepartment } = req.body;

    await this.employeeService
      .update(empID, empName, empActive, empDepartment, creator)
      .then((result: any) => {
        if (result.affectedRows > 0) {
          return res.status(200).json({
            success: true,
            message: 'Update successfully!'
          });
        }

        if (result.affectedRows === 0) {
          return res.status(401).json({
            success: false,
            message: 'You are not authorized!'
          });
        }
      }).catch((err: any) => {
        return res.status(500).json({
          success: false,
          message: 'Updating an employee failed!'
        });
      });
  }

  async deleteEmployee(req: any, res: any) {
    const empID: number = req.params.empID;
    const creator: string = req.userData.userId;

    await this.employeeService.delete(empID, creator)
      .then((result: any) => {
        if (result.affectedRows > 0) {
          return res.status(200).json({
            success: true,
            message: 'Deletion successful!'
          });
        }

        if (result.affectedRows === 0) {
          return res.status(401).json({
            success: false,
            message: 'You are not authorized!'
          });
        }
      }).catch((err: any) => {
        return res.status(500).json({
          success: false,
          message: 'Deleting an employee failed!'
        });
      });
  }
}
