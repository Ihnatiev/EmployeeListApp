import { Component, OnInit, OnDestroy } from '@angular/core';
import { EmployeesService } from '../employees.service';
import { Subscription } from 'rxjs';
import { Employee } from '../employee.model';

@Component({
  selector: 'app-emp-view',
  templateUrl: './emp-view.component.html',
  styleUrls: ['./emp-view.component.css']
})

export class EmpViewComponent implements OnInit {

  employees: Employee[] = [];
  private employeeSub!: Subscription;

  constructor(
    public employeesService: EmployeesService,
  ) { }

  ngOnInit() {
    this.employeeSub = this.employeesService
      .getEmployeeUpdateListener()
      .subscribe((employeeData: { employees: Employee[], employeeCount: number}) => {
        this.employees = employeeData.employees;
      });
  }
}
