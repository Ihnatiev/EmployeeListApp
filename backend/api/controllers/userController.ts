import { UserService } from '../services/userService';
import { IDBConnection } from '../config/IDBConnection';
import secret from '../config/secret';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export class UserController {
  private userService: UserService;

  constructor(dbConnection: IDBConnection) {
    this.userService = new UserService(dbConnection);
  }

  public async createUser(req: any, res: any) {
    try {
      const { name, email, password } = req.body;
      await this.userService.signup(name, email, password)
        .then(user => {
          return res.status(201).json({
            success: true,
            message: 'User created!',
            userId: user.id
          });
        }).catch(err => {
          return res.status(500).json({
            success: false,
            message: 'Sorry. That email already exists. Try again.'
          });
        });
    } catch {
      return res.status(500).json({
        success: false,
        message: 'Invalid authentication credentials!'
      });
    }
  }

  public async loginUser(req: any, res: any) {
    try {
      const email = req.body.email;
      const password = req.body.password;
      const user = await this.userService.login(email);
      if (!user) {
        return res.status(400).json({
          success: false,
          message: 'Auth failed! Check your email.'
        });
      }
      if (user) {
        const result = await bcrypt.compare(password, user.password);
        if (!result) {
          return res.status(401).json({
            success: false,
            message: 'Email and password does not match.'
          });
        }
        if (result) {
          const token: string = jwt.sign(
            { userId: user.id, email: user.email },
            secret.jwtSecret, { algorithm: 'HS256', expiresIn: '1h' });
          return res.status(200).json({
            token,
            expiresIn: 3600,
            userId: user.id,
            userName: user.name
          });
        }
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  }
}

