import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import swaggerUi from 'swagger-ui-express';
import swagDoc from './swagger/swagger.json';

const app = express();
require('./helpers/cors').init(app);

mongoose
    .connect(
        "mongodb+srv://valerii_mongo:valerii_mongo@cluster0-mypsi.mongodb.net/test",
        { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Connected to Mongo database!");
    })
    .catch(() => {
        console.log("Connection failed!");
    });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swagDoc));

export default app;
