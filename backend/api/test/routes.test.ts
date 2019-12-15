import express, { Router } from 'express';
import { applyMiddleware, applyRoutes } from '../utils';
import errorHandlers from '../middleware/errorHandlers';
import routes from '../routes/routes';
import middleware from '../middleware';
import request from 'supertest';

describe("Routes", () => {
  let router: Router;

  beforeEach(() => {
    router = express();
    applyMiddleware(middleware, router);
    applyRoutes(routes, router);
    applyMiddleware(errorHandlers, router);
  });
  describe("Employees", () => {
    test("a valid string query for get all employees - return 200", async () => {
      const response = await request(router).get("/api/employees?pagesize=1&page=0");
      expect(response.status).toEqual(200);
      expect(response.body).toStrictEqual({
        "employees": [
          {
            "empID": 1,
            "empName": "Lisa",
            "creator": "f6f7dd58-0b07-494e-85d6-c0c03b902256",
            "empActive": "Yes",
            "dpName": "HR"
          }],
        "maxEmployees": 4
      });
    });
    test("an invalid string query for get all employees - return 400", async () => {
      const response = await request(router).get("/api/employees?pagesize=1");
      expect(response.status).toEqual(400);
    });
    test("a valid string query for get an employee - return 200", async () => {
      const response = await request(router).get("/api/employees/1");
      expect(response.status).toEqual(200);
      expect(response.body).toStrictEqual({
        "success": true,
        "employee": [
          {
            "empID": 1,
            "empName": "Lisa",
            "empActive": "Yes",
            "dpName": "HR"
          }
        ]
      });
    });
    test("an invalid string query for get an employee - return 400", async () => {
      const response = await request(router).get("/api/employees/");
      expect(response.status).toEqual(400);
    });
    describe("Requests without authentication to routes of employees", () => {
      const data = {
        "empName": "Test Rout",
        "empActive": true,
        "empDepartment": 1
      };
      test("try to post an employee without authentication - return 401", async () => {
        await request(router)
          .post("/api/employees/")
          .send(data)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(401)
          .expect({ message: 'You are not authenticated!' });
      });
      test("try to update an employee without authentication - return 401", async () => {
        await request(router)
          .put("/api/employees/1")
          .send(data)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(401)
          .expect({ message: 'You are not authenticated!' });
      });
      test("try to delete an employee without authentication - return 401", async () => {
        await request(router)
          .delete("/api/employees/1")
          .expect(401)
          .expect({ message: 'You are not authenticated!' });
      });
    });
    describe("Request with authentication to routes of employees", () => {
      let token: string;
      let employeeId: any;
      beforeAll((done) => {
        router = express();
        applyMiddleware(middleware, router);
        applyRoutes(routes, router);
        applyMiddleware(errorHandlers, router);
        const userLog = {
          "email": "testUser@test.com",
          "password": "superPassword"
        };
        request(router)
          .post("/api/auth/login")
          .send(userLog)
          .set('Accept', 'application/json')
          .end((err, response) => {
            token = response.body.token; // save the token!
            done();
          });
      });
      const data = {
        "empName": "Test Emp",
        "empActive": true,
        "empDepartment": 1 //HR
      };
      test("Create an employee", async () => {
        await request(router)
          .post("/api/employees/")
          .send(data)
          .set('Authorization', `Bearer ${token}`)
          .expect('Content-Type', /json/)
          .then((response) => {
            expect(response.status).toEqual(201);
            employeeId = response.body.employee;
          });
      });
      test('Get an employee', async () => {
        await request(router)
          .get('/api/employees/' + employeeId)
          .then((response) => {
            expect(response.status).toBe(200);
          });
      });
      test('Update an employee', async () => {
        await request(router)
          .put('/api/employees/' + employeeId)
          .send({
            empName: 'Test Emp',
            empActive: false,
            empDepartment: 1 // HR
          })
          .set('Authorization', `Bearer ${token}`)
          .then((response) => {
            expect(response.status).toBe(200);
          });
      });
      test('Delete an employee', async () => {
        await request(router)
          .delete('/api/employees/' + employeeId)
          .set('Authorization', `Bearer ${token}`)
          .then((response) => {
            expect(response.status).toBe(200);
          });
      });
    });
  });
  describe("Users", () => {
    test.skip("signup user - return 201", async () => {
      const user = {
        "name": "Test User",
        "email": "testUser@test.com",
        "password": "superPassword"
      };
      await request(router)
        .post("/api/auth/signup")
        .send(user)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(201);
    });
    test("signup user - return 500", async () => {
      const user = {
        "name": "Test User",
        "email": "testUser@test.com",
        "password": "superPassword"
      };
      await request(router)
        .post("/api/auth/signup")
        .send(user)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(500)
        .expect({ success: false, message: 'Sorry. That email already exists. Try again.' })
    });
    test("login user - return 200", async () => {
      const userLog = {
        "email": "testUser@test.com",
        "password": "superPassword"
      };
      await request(router)
        .post("/api/auth/login")
        .send(userLog)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200);
    });
    test("login user - return 400", async () => {
      const userLog = {
        "email": "test@test.com",
        "password": "superPassword"
      };
      await request(router)
        .post("/api/auth/login")
        .send(userLog)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(400)
        .expect({ success: false, message: 'Auth failed! Check your email.' })
    });
    test("login user - return 401", async () => {
      const userLog = {
        "email": "testUser@test.com",
        "password": "superPass"
      };
      await request(router)
        .post("/api/auth/login")
        .send(userLog)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(401)
        .expect({ success: false, message: 'Email and password does not match.' })
    });
  });
});
