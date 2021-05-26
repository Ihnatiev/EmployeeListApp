export class User {
  private userId: string;
  private userName: string;
  private userEmail: string;
  private userPassword: string;

  get id(): string {
    return this.userId;
  }

  set id(id: string) {
    this.userId = id;
  }

  get name(): string {
    return this.userName;
  }

  set name(name: string) {
    this.userName = name;
  }

  get email(): string {
    return this.userEmail;
  }

  set email(email: string) {
    this.userEmail = email;
  }

  get password(): string {
    return this.userPassword;
  }

  set password(password: string) {
    this.userPassword = password;
  }

  constructor(id: string = '', name: string = '', email: string = '', password: string = '') {
    this.userId = id;
    this.userName = name;
    this.userEmail = email;
    this.userPassword = password;
  }
}
