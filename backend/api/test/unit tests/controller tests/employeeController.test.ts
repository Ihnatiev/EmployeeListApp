import { EmployeesController } from '../../../controllers/employeeController';
import { EmployeesService } from '../../../services/employeeService';

jest.mock('../../../services/employeeService', () => {
  const mEmployeesService = {
    findCount: jest.fn(),
    findAll: jest.fn(),
    find: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    create: jest.fn()
  };
  return { EmployeesService: jest.fn(() => mEmployeesService) };
});

describe('Employees', () => {
  describe('Get request for all employees', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
    test('should return status 200 - get all employees', async () => {
      const mConnection = {
        execute(query: string, params: any) { }
      };
      const expectedEmp = {
        empID: 1,
        empName: 'Lisa',
        empActive: 'Yes',
        empDepartment: 'HR',
        creator: '48850418-bb67-489d-a391-575bcb110ed5'
      };

      const employeeService = new EmployeesService(mConnection);
      (employeeService.findCount as jest.MockedFunction<any>)
        .mockResolvedValueOnce([{ totalCount: 5 }]);
      (employeeService.findAll as jest.MockedFunction<any>)
        .mockResolvedValueOnce([expectedEmp]);

      const mReq = {
        query: { pagesize: 1, page: 0 }
      };
      const mRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const employeesController = new EmployeesController(mConnection);
      await employeesController.findAllEmployees(mReq, mRes);
      expect(employeeService.findCount).toHaveBeenCalledTimes(1);
      expect(employeeService.findAll).toHaveBeenCalledTimes(1);
      expect(employeeService.findAll).toBeCalledWith(1, 0);
      expect(mRes.status).toBeCalledWith(200);
      expect(mRes.status().json).toBeCalledWith({ employees: [expectedEmp], maxEmployees: 5 });
    });
    test('should return status 400 - bad query', async () => {
      const mConnection = {
        execute(query: string, params: any) { }
      };
      const employeeService = new EmployeesService(mConnection);
      (employeeService.findCount as jest.MockedFunction<any>)
        .mockResolvedValueOnce([{ totalCount: 0 }]);
      (employeeService.findAll as jest.MockedFunction<any>)
        .mockResolvedValueOnce([]);
      const mReq = {
        query: {
          pagesize: 1,
          page: 0
        }
      };
      const mRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const employeesController = new EmployeesController(mConnection);
      await employeesController.findAllEmployees(mReq, mRes);
      expect(employeeService.findCount).toHaveBeenCalledTimes(1);
      expect(employeeService.findAll).toHaveBeenCalledTimes(1);
      expect(employeeService.findAll).toBeCalledWith(1, 0);
      expect(mRes.status).toBeCalledWith(404);
      expect(mRes.status().json).toBeCalledWith({ success: false, message: 'Employee not found' });
    });
    test('should return status 400 - server error (bad query)', async () => {
      const mConnection = {
        execute(query: string, params: any) { }
      };
      const employeeService = new EmployeesService(mConnection);
      (employeeService.findCount as jest.MockedFunction<any>)
        .mockResolvedValueOnce();
      (employeeService.findAll as jest.MockedFunction<any>)
        .mockResolvedValueOnce();
      const mReq = {
        query: { pagesize: 1 }
      };
      const mRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const employeesController = new EmployeesController(mConnection);
      await employeesController.findAllEmployees(mReq, mRes);
      expect(employeeService.findCount).toHaveBeenCalledTimes(1);
      expect(employeeService.findAll).toHaveBeenCalledTimes(1);
      expect(mRes.status).toBeCalledWith(400);
      expect(mRes.status().json).toBeCalledWith({ success: false, message: 'Server error' });
    });
  });
  describe('Get request for an employee', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
    test('should return status 200 - get an employee', async () => {
      const mConnection = {
        execute(query: string, params: any) { }
      };
      const expectedEmp = {
        empID: 1,
        empName: 'Lisa',
        empActive: 'Yes',
        empDepartment: 'HR'
      };

      const employeeService = new EmployeesService(mConnection);
      (employeeService.find as jest.MockedFunction<any>)
        .mockResolvedValueOnce(expectedEmp);

      const mReq = {
        params: { empID: 1 }
      };
      const mRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const employeesController = new EmployeesController(mConnection);
      await employeesController.findEmployee(mReq, mRes);
      expect(employeeService.find).toHaveBeenCalledTimes(1);
      expect(mRes.status).toBeCalledWith(200);
      expect(mRes.status().json).toBeCalledWith({ success: true, employee: [expectedEmp] });
    });
    test('should return status 404 - employee not found', async () => {
      const mConnection = {
        execute(query: string, params: any) { }
      };

      const employeeService = new EmployeesService(mConnection);
      (employeeService.find as jest.MockedFunction<any>)
        .mockResolvedValueOnce(undefined);

      const mReq = {
        params: { empID: 111 }
      };
      const mRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const employeesController = new EmployeesController(mConnection);
      await employeesController.findEmployee(mReq, mRes);
      expect(employeeService.find).toHaveBeenCalledTimes(1);
      expect(mRes.status).toBeCalledWith(404);
      expect(mRes.status().json).toBeCalledWith({ success: false, message: 'Employee not found!' });
    });
    test('should return status 500 - server erorr', async () => {
      const mConnection = {
        execute(query: string, params: any) { }
      };

      const mReq = {};
      const mRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const employeesController = new EmployeesController(mConnection);
      await employeesController.findEmployee(mReq, mRes);
      expect(mRes.status).toBeCalledWith(500);
      expect(mRes.status().json).toBeCalledWith({ success: false, message: 'Server error' });
    });
  });
  describe('Put request for an employee', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
    test('should return status 200 - update an employee', async () => {
      const mConnection = {
        execute(query: string, params: any) { }
      };

      const employeeService = new EmployeesService(mConnection);
      (employeeService.update as jest.MockedFunction<any>)
        .mockResolvedValueOnce({ affectedRows: 1 });

      const mReq = {
        params: { empID: 1 },
        userData: { userId: '48850418-bb67-489d-a391-575bcb110ed5' },
        body: { empName: 'Lisa', empActive: 'No', empDepartment: 'Tech' }
      };
      const mRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const employeesController = new EmployeesController(mConnection);
      await employeesController.updateEmployee(mReq, mRes);
      expect(employeeService.update).toHaveBeenCalledTimes(1);
      expect(mRes.status).toBeCalledWith(200);
      expect(mRes.status().json).toBeCalledWith({ success: true, message: 'Update successfully!' });
    });
    test('should return status 401 - unauthorized', async () => {
      const mConnection = {
        execute(query: string, params: any) { }
      };

      const employeeService = new EmployeesService(mConnection);
      (employeeService.update as jest.MockedFunction<any>)
        .mockResolvedValueOnce({ affectedRows: 0 });

      const mReq = {
        params: { empID: 1 },
        userData: { userId: '41492418-ba65-439y-a168-5itd79zvdf' },
        body: { empName: 'Lisa', empActive: 'No', empDepartment: 'Tech' }
      };
      const mRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const employeesController = new EmployeesController(mConnection);
      await employeesController.updateEmployee(mReq, mRes);
      expect(employeeService.update).toHaveBeenCalledTimes(1);
      expect(mRes.status).toBeCalledWith(401);
      expect(mRes.status().json).toBeCalledWith({ success: false, message: 'You are not authorized!' });
    });
    test('should return status 500 - updating an employee failed', async () => {
      const mConnection = {
        execute(query: string, params: any) { }
      };

      const employeeService = new EmployeesService(mConnection);
      (employeeService.update as jest.MockedFunction<any>)
        .mockResolvedValueOnce(undefined);

      const mReq = {
        params: { empID: 1 },
        userData: { userId: '48850418-bb67-489d-a391-575bcb110ed5' },
        body: { empActive: 'No', empDepartment: 'Tech' }
      };
      const mRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const employeesController = new EmployeesController(mConnection);
      await employeesController.updateEmployee(mReq, mRes);
      expect(employeeService.update).toHaveBeenCalledTimes(1);
      expect(mRes.status).toBeCalledWith(500);
      expect(mRes.status().json).toBeCalledWith({ success: false, message: 'Updating an employee failed!' });
    });
  });
  describe('Delete request for an employee', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
    test('should return status 200 - deleting an employee successful', async () => {
      const mConnection = {
        execute(query: string, params: any) { }
      };

      const employeeService = new EmployeesService(mConnection);
      (employeeService.delete as jest.MockedFunction<any>)
        .mockResolvedValueOnce({ affectedRows: 1 });

      const mReq = {
        params: { empID: 1 },
        userData: { userId: '48850418-bb67-489d-a391-575bcb110ed5' },
        body: { empName: 'Lisa', empActive: 'No', empDepartment: 'Tech' }
      };
      const mRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const employeesController = new EmployeesController(mConnection);
      await employeesController.deleteEmployee(mReq, mRes);
      expect(employeeService.delete).toHaveBeenCalledTimes(1);
      expect(mRes.status).toBeCalledWith(200);
      expect(mRes.status().json).toBeCalledWith({ success: true, message: 'Deletion successful!' });
    });
    test('should return status 401 - unauthorized', async () => {
      const mConnection = {
        execute(query: string, params: any) { }
      };

      const employeeService = new EmployeesService(mConnection);
      (employeeService.delete as jest.MockedFunction<any>)
        .mockResolvedValueOnce([]);

      const mReq = {
        params: { empID: 1 },
        userData: { userId: '41492418-ba65-439y-a168-5itd79zvdf' }
      };
      const mRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const employeesController = new EmployeesController(mConnection);
      await employeesController.deleteEmployee(mReq, mRes);
      expect(employeeService.delete).toHaveBeenCalledTimes(1);
      expect(mRes.status).toBeCalledWith(401);
      expect(mRes.status().json).toBeCalledWith({ success: false, message: 'You are not authorized!' });
    });
    test('should return status 500 - deleting an employee failed', async () => {
      const mConnection = {
        execute(query: string, params: any) { }
      };

      const employeeService = new EmployeesService(mConnection);
      (employeeService.delete as jest.MockedFunction<any>)
        .mockResolvedValueOnce();

      const mReq = {
        params: {},
        userData: {}
      };
      const mRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const employeesController = new EmployeesController(mConnection);
      await employeesController.deleteEmployee(mReq, mRes);
      expect(employeeService.delete).toHaveBeenCalledTimes(1);
      expect(mRes.status).toBeCalledWith(500);
      expect(mRes.status().json).toBeCalledWith({ success: false, message: 'Deleting an employee failed!' });
    });
  });
  describe('Post request for an employee', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
    test('should return status 201 - employee added', async () => {
      const mConnection = {
        execute(query: string, params: any) { }
      };

      const employeeService = new EmployeesService(mConnection);
      (employeeService.create as jest.MockedFunction<any>)
        .mockResolvedValueOnce({
          empID: 6,
          empName: 'Max',
          empActive: true,
          empDepartment: 'Tech',
          creator: '48850418-bb67-489d-a391-575bcb110ed5'
        });

      const mReq = {
        userData: { userId: '48850418-bb67-489d-a391-575bcb110ed5' },
        body: { empName: 'Max', empActive: true, empDepartment: 'Tech' }
      };
      const mRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const employeesController = new EmployeesController(mConnection);
      await employeesController.createEmployee(mReq, mRes);
      expect(employeeService.create).toHaveBeenCalledTimes(1);
      expect(mRes.status).toBeCalledWith(201);
      expect(mRes.status().json).toBeCalledWith({
        success: true,
        message: 'Employee added successfully!',
        employee: 6
      });
    });
    test('should return status 500 - adding employee failed', async () => {
      const mConnection = {
        execute(query: string, params: any) { }
      };

      const employeeService = new EmployeesService(mConnection);
      (employeeService.create as jest.MockedFunction<any>)
        .mockResolvedValueOnce();

      const mReq = {
        userData: { userId: '48850418-bb67-489d-a391-575bcb110ed5' },
        body: { empActive: true, empDepartment: 'Tech' }
      };
      const mRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const employeesController = new EmployeesController(mConnection);
      await employeesController.createEmployee(mReq, mRes);
      expect(employeeService.create).toHaveBeenCalledTimes(1);
      expect(mRes.status).toBeCalledWith(500);
      expect(mRes.status().json).toBeCalledWith({ success: false, message: 'Adding employee failed!' });
    });
  });
});





