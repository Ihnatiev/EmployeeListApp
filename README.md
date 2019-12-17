# EmployeeListApp
 
EmployeeListApp built with [NodeJS(v10.13)](https://nodejs.org/uk/), [TypeScript(v3.5.3)](https://www.typescriptlang.org/), [MySQL(v2.17.1)](https://www.mysql.com/), [SwaggerUI Express(v4.1.1)](https://swagger.io/tools/swagger-ui/) and [Angular(v8.2.2)](https://angular.io/). Also, upon completion of writing the backend, unit and integration tests were written in [Jest(v24.9.0)](https://jestjs.io/en/).

Node provides the RESTful API. Angular provides the frontend and accesses the API. MySQL stores like a hoarder. In this project, a database is created automatically. Database configurations are in [this file](https://github.com/Ihnatiev/EmployeeListApp/blob/master/backend/api/config/DBkeys.ts).

# Requirements
 [NodeJS(v10.13)](https://nodejs.org/uk/) and [npm](https://docs.npmjs.com/)

# Installation
1. Clone or download the [repository](https://github.com/Ihnatiev/EmployeeListApp.git)
2. Install node packages in root for angular: npm install
3. Install node packages in backend directory for REST API: npm install

## Servers start
In backend directory run command `npm run dev` for build the backend project.
Then run command `npm run start` in the same directory.

After starting the server - go to the frontend.
In frontend directory run command `npm run start` and navigate to `[https://localhost:4200/](https://localhost:4200/)`. 

## Run unit and integration tests

To run tests need to run command `npm run test` via [Jest(v24.9.0)](https://jestjs.io/en/).

## Run swagger UI

Navigate to `https://localhost:4201/api-docs/`
