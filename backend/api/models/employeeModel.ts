export class Employee {
  private employeeId: number;
  private employeeName: string;
  private employeeActive: boolean;
  private employeeDepartment: number;
  private employeeCreator: string;
  totalCount: any;

  get empID(): number {
    return this.employeeId;
  }

  set empID(empID: number) {
    this.employeeId = empID;
  }

  get empName(): string {
    return this.employeeName;
  }

  set empName(empName: string) {
    this.employeeName = empName;
  }

  get empActive(): boolean {
    return this.employeeActive;
  }

  set empActive(empActive: boolean) {
    this.employeeActive = empActive;
  }

  get empDepartment(): number {
    return this.employeeDepartment;
  }

  set empDepartment(empDepartment: number) {
    this.employeeDepartment = empDepartment;
  }

  get creator(): string {
    return this.employeeCreator;
  }

  set creator(creator: string) {
    this.employeeCreator = creator;
  }

  constructor(empID: number = 0, empName: string = '', empActive: boolean = false, empDepartment: number = 0, creator: string = '') {
    this.employeeId = empID;
    this.employeeName = empName;
    this.employeeActive = empActive;
    this.employeeDepartment = empDepartment;
    this.employeeCreator = creator;
  }
}


