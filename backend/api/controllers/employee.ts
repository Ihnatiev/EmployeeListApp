import Employee from '../models/employee';

export class EmployeeContr {
    public async create(req: any, res: any) {
        const employee = new Employee({
            empName: req.body.empName,
            empActive: req.body.empActive,
            empDepartment: req.body.empDepartment,
            creator: req.userData.userId
        });
        console.log(employee)
        employee.save()
            .then(createdEmployee => {
                res.status(201).json({
                    message: 'Employee created successfully',
                    employee: {
                        id: createdEmployee._id
                    }
                });
                console.log(createdEmployee)
            }).catch(error => {
                res.status(500).json({
                    message: 'Creating an employee failed!'
                });
            });
    }
}