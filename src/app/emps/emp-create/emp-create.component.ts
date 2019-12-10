import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

import { EmployeesService } from '../employees.service';
import { Employee } from '../employee.model';

@Component({
  selector: 'app-emp-create',
  templateUrl: './emp-create.component.html',
  styleUrls: ['./emp-create.component.css']
})
export class EmpCreateComponent implements OnInit, OnDestroy {

  empDep = [
    { id: 1, dpName: 'HR' },
    { id: 2, dpName: 'Tech' },
    { id: 3, dpName: 'Finance' }
  ];

  employee!: Employee;
  isActive = false;
  empDepartment = null;
  isLoading = false;

  private employeeId!: number;
  private mode = 'create';
  private authStatusSub!: Subscription;

  constructor(
    public employeesService: EmployeesService,
    public route: ActivatedRoute,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(authStatus => {
        this.isLoading = false;
      });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('employeeId')) {
        this.mode = 'edit';
        // tslint:disable-next-line: no-non-null-assertion
        this.employeeId = JSON.parse(paramMap.get('employeeId')!);
        this.employeesService.getEmployee(this.employeeId);
      } else {
        this.mode = 'create';
        this.employeeId = 0;
      }
    });
  }

  onSaveEmp(form: NgForm) {
    if (this.mode === 'create') {
      this.employeesService.addEmployee(
        form.value.empName,
        form.value.isActive,
        form.value.empDepartment
      );
    } else {
      this.employeesService.updateEmployee(
        this.employeeId,
        form.value.empName,
        form.value.isActive,
        form.value.empDepartment
      );
    }
    form.resetForm();
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}

