import { User } from '../models/userModel';
import { IDBConnection } from '../config/IDBConnection';
import { v4 as uuid } from 'uuid';
import bcrypt from 'bcrypt';

export class UserService {
  private connection: any;

  constructor(connection: IDBConnection) {
    this.connection = connection;
  };

  async signup(name: string, email: string, password: string): Promise<User> {
    const user = new User();
    user.id = uuid();
    user.name = name;
    user.email = email;
    user.password = bcrypt.hashSync(password, 10);
    await this.connection.execute(
      'INSERT INTO EmployeeDB.Users SET id = ?, name = ?, email = ?, password = ?',
      [
        user.id,
        user.name,
        user.email,
        user.password
      ]);
    user.id = user.id;
    return user;
  }

  async login(email: string): Promise<User> {
    const queryResults = await this.connection.execute(
      'SELECT * FROM EmployeeDB.Users WHERE email = ?', [email]);
    return queryResults[0];
  }
}

