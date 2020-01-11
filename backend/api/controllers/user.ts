import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import secret from '../config/secret';
import User from '../models/User';

export class UserContr {
    public async createUser(req: any, res: any) {
        bcrypt.hash(req.body.password, 10).then(hash => {
            const user = new User({
                name: req.body.name,
                email: req.body.email,
                password: hash
            });
            user.save()
                .then((result: any) => {
                    res.status(201).json({
                        message: 'User created!',
                        result: result
                    });
                })
                .catch((error: any) => {
                    res.status(500).json({
                        message: 'Invalid authentication credentials!'
                    });
                });
        });
    }

    public async userLogin(req: any, res: any) {
        let fetchedUser: any;
        User.findOne({ email: req.body.email })
            .then(user => {
                if (!user) {
                    return res.status(401).json({
                        message: 'Auth failed'
                    });
                }
                fetchedUser = user;
                return bcrypt.compare(req.body.password, user.password);
            })
            .then(result => {
                if (!result) {
                    return res.status(401).json({
                        message: 'Auth failed'
                    });
                }
                const token = jwt.sign(
                    { email: fetchedUser.email, userId: fetchedUser._id },
                    secret.jwtSecret,
                    { expiresIn: '1h' }
                );
                res.status(200).json({
                    token: token,
                    expiresIn: 3600,
                    userId: fetchedUser._id,
                    userName: fetchedUser.name
                });
            })
            .catch(err => {
                return res.status(401).json({
                    message: 'Invalid authentication credentials!'
                });
            });
    }
}
