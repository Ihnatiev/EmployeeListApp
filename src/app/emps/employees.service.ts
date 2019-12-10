import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';
import { Employee } from './employee.model';

const BACKEND_URL = environment.apiUrl + '/employees/';

@Injectable({ providedIn: 'root' })
export class EmployeesService {
  private employees: Employee[] = [];
  private employeesUpdated = new Subject<{ employees: Employee[], employeeCount: number }>();

  constructor(private http: HttpClient, private router: Router) { }

  getEmployees(empsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${empsPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; employees: any; maxEmployees: number }>(
        BACKEND_URL + queryParams)
      .pipe(map(employeeData => {
        return {
          employees: employeeData.employees.map((employee: any) => {
            return {
              empID: employee.empID,
              empName: employee.empName,
              empActive: employee.empActive,
              empDepartment: employee.dpName,
              creator: employee.creator
            };
          }),
          maxEmployees: employeeData.maxEmployees
        };
      }))
      .subscribe(transformedEmployeeData => {
        this.employees = transformedEmployeeData.employees;
        this.employeesUpdated.next({
          employees: [...this.employees],
          employeeCount: transformedEmployeeData.maxEmployees
        });
      });
  }

  getEmployeeUpdateListener() {
    return this.employeesUpdated.asObservable();
  }

  getEmployee(employeeId: number) {
    this.http.get<{ employee: any }>(BACKEND_URL + employeeId)
      .pipe(map(employeeData => {
        return employeeData.employee.map((employee: any) => {
          return {
            empID: employee.empID,
            empName: employee.empName,
            empActive: employee.empActive,
            empDepartment: employee.dpName
          };
        });
      }))
      .subscribe(transformedEmployee => {
        this.employees = transformedEmployee;
        this.employeesUpdated.next({
          employees: [...this.employees],
          employeeCount: transformedEmployee.maxEmployees
        });
      });
    return { ...this.employees.find(e => e.empID === employeeId) };
  }

  addEmployee(empName: string, empActive: boolean, empDepartment: string) {
    const employee: Employee = { empID: 0, empName, empActive, empDepartment, creator: '' };
    this.http
      .post<{ employeeId: number }>(BACKEND_URL, employee)
      .subscribe(responseData => {
        this.router.navigate(['/']);
      });
  }

  updateEmployee(employeeId: number, empName: string, empActive: boolean, empDepartment: string) {
    const employee: Employee = { empID: employeeId, empName, empActive, empDepartment, creator: '' };
    return this.http.put(BACKEND_URL + employeeId, employee)
      .subscribe(() => {
        this.router.navigate(['/']);
      });
  }

  deleteEmployee(employeeId: number) {
    return this.http.delete(BACKEND_URL + employeeId);
  }
}
