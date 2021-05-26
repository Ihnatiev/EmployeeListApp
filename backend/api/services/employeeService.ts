import { Employee } from '../models/employeeModel';
import { IDBConnection } from '../config/IDBConnection';

export class EmployeesService {
  private connection: any;

  constructor(connection: IDBConnection) {
    this.connection = connection;
  }

  async find(empID: number): Promise<Employee> {
    const queryResult: any = await this.connection.execute(
      `SELECT empID, empName, IF (empActive, 'Yes', 'No')
      empActive, dpName FROM EmployeeDB.Employees NNER JOIN EmployeeDB.Departments
      ON empDepartment = dpID WHERE empID = ?`, empID);

    return queryResult[0];
  }

  public async findCount() {
    const results: any = await this.connection.execute('SELECT count(*) as totalCount FROM EmployeeDB.Employees');
    return results;
  }

  async findAll(numPerPage: number, page: number) {
    let results: any[] = [];
    const skip: number = page * numPerPage;
    const endLimit: number = numPerPage;
    const limit: string = skip + ',' + endLimit;
    const queryResults: any = await this.connection.execute(
      `SELECT empID, empName, creator, IF (empActive, 'Yes', 'No')
    empActive, dpName FROM EmployeeDB.Employees
    INNER JOIN EmployeeDB.Departments ON empDepartment = dpID ORDER BY empID LIMIT ` + limit);

    results = queryResults.map((m: any) => {
      return m;
    });

    return results;
  }

  async create(empName: string, empActive: boolean, empDepartment: number, creator: string): Promise<Employee> {
    const employee: Employee = new Employee();
    employee.empName = empName;
    employee.empActive = empActive;
    employee.empDepartment = empDepartment;
    employee.creator = creator;
    const result: any = await this.connection.execute(
      `INSERT INTO EmployeeDB.Employees SET empName = ?, empActive = ?, empDepartment = ?, creator = ?`,
      [
        employee.empName,
        employee.empActive,
        employee.empDepartment,
        employee.creator
      ]);
    employee.empID = result.insertId;

    return employee;
  }

  async update(empID: number, empName: string, empActive: boolean, empDepartment: number, creator: string): Promise<Employee> {
    const employee: Employee = await this.find(empID);
    employee.empName = empName;
    employee.empActive = empActive;
    employee.empDepartment = empDepartment;
    employee.creator = creator;
    const result: any = await this.connection.execute(
      `UPDATE EmployeeDB.Employees SET empName = ?, empActive = ?, empDepartment = ? WHERE empID = ? AND creator = ?`,
      [
        employee.empName,
        employee.empActive,
        employee.empDepartment,
        employee.empID,
        creator
      ]);

    return result;
  }

  async delete(empID: number, creator: string): Promise<Employee> {
    const employee: Employee = await this.find(empID);
    const result: any = await this.connection.execute(
      `DELETE FROM EmployeeDB.Employees WHERE empID = ? AND creator = ?`,
      [employee.empID, creator]);

    return result;
  }
}
