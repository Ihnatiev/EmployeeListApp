export class Employee {
  private _empID: number;
  private _empName: string;
  private _empActive: boolean;
  private _empDepartment: number;
  private _creator: string;
  totalCount: any;

  get empID(): number {
    return this._empID;
  }

  set empID(empID: number) {
    this._empID = empID;
  }

  get empName(): string {
    return this._empName;
  }

  set empName(empName: string) {
    this._empName = empName;
  }

  get empActive(): boolean {
    return this._empActive;
  }

  set empActive(empActive: boolean) {
    this._empActive = empActive;
  }

  get empDepartment(): number {
    return this._empDepartment;
  }

  set empDepartment(empDepartment: number) {
    this._empDepartment = empDepartment;
  }

  get creator(): string {
    return this._creator;
  }

  set creator(creator: string) {
    this._creator = creator;
  }

  constructor(empID: number = 0, empName: string = "", empActive: boolean = false, empDepartment: number = 0, creator: string = '') {
    this._empID = empID;
    this._empName = empName;
    this._empActive = empActive;
    this._empDepartment = empDepartment;
    this._creator = creator;
  }
}


