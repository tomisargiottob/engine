import express from "express";
import config from "config";
import { initialize } from "express-openapi";
import logger from "./components/logger";
import openapiParser from 'swagger-parser';
import Database from "./components/database";

function errorHandler(err, req, res, next) {
    if (err.status === 400) {
      logger.info({ method: req.method, endpoint: req.url }, 'Request did not pass the validation schema');
      res.status(400).json({ errors: err.errors });
    } else {
      next(err);
    }
  }

async function main() {
    const app = express()
    app.use(express.json())
    const db = new Database({logger},config.db);
    logger.info('Connecting to database');
    await db.connect();
    const apiDoc = await openapiParser.dereference('src/api/openapi.yaml')
    initialize({
      app,
      apiDoc,
      dependencies: {
        logger,
        db
      },
      errorMiddleware: errorHandler,
      promiseMode: true,
      paths: './src/api/controllers'
    })
    app.listen(config.port, () => {
        logger.info(`Server up and running on Port ${config.port}`)
    })
}

main();