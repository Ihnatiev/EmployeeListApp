import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageEvent } from '@angular/material';
import { Subscription } from 'rxjs';

import { Employee } from '../employee.model';
import { EmployeesService } from '../employees.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-emp-list',
  templateUrl: './emp-list.component.html',
  styleUrls: ['./emp-list.component.css']
})
export class EmpListComponent implements OnInit, OnDestroy {
  displayedColumns = ['view', 'edit', 'Id', 'Name', 'Active', 'Department', 'delete'];

  employees: Employee[] = [];
  userId!: string;
  search!: string;
  empNameInput!: string;

  isLoading = false;
  totalEmployees = 0;
  empsPerPage = 5;
  currentPage = 0;
  pageSizeOptions = [5, 10, 15, 20];
  userIsAuthenticated = false;

  private employeesSub!: Subscription;
  private authStatusSub!: Subscription;

  constructor(
    public employeesService: EmployeesService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.isLoading = true;
    this.userId = this.authService.getUserId();
    this.employeesService.getEmployees(this.empsPerPage, this.currentPage);
    this.employeesSub = this.employeesService
      .getEmployeeUpdateListener()
      .subscribe((employeeData: { employees: Employee[], employeeCount: number }) => {
        this.isLoading = false;
        this.employees = employeeData.employees;
        this.totalEmployees = employeeData.employeeCount;
      });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userId = this.authService.getUserId();
        this.userIsAuthenticated = isAuthenticated;
      });
  }

  onSearch() {
    this.search = this.empNameInput;
  }

  onView(employeeId: number) {
    this.employeesService.getEmployee(employeeId);
  }

  onChangedPage(pageData: PageEvent) {
    this.currentPage = pageData.pageIndex;
    this.empsPerPage = pageData.pageSize;
    this.employeesService.getEmployees(this.empsPerPage, this.currentPage);
  }

  onDelete(employeeId: number) {
    this.employeesService.deleteEmployee(employeeId).subscribe(() => {
      this.employeesService.getEmployees(this.empsPerPage, this.currentPage);
    }, () => {
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.employeesSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
