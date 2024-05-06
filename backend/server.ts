import { ic } from "azle";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";

import { Database } from "./database";

export async function CreateServer() {
  const database = new Database();
  await database.init();

  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(async (req, res, next) => {
    req.database = database;
    next();
  });

  app.use(function (err: Error, req: Request, res: Response, next: NextFunction) {
    console.error(err.message);
    res.status(500).send("Something broke!");
  });

  function AuthGuard(req: Request, res: Response, next: NextFunction) {
    if (ic.caller().isAnonymous()) {
      res.status(401);
      res.send("You are not authorized to access this resource.");
    } else {
      next();
    }
  }

  app.get("/health", (req, res) => {
    res.send().statusCode = 204;
  });

  app.post("/contacts", AuthGuard, (req, res) => {
    const { name, email } = req.body;

    const result = req.database.exec(`
      INSERT INTO contacts (name, email) VALUES ('${name}', '${email}')
    `);

    res.json({
      name,
      email,
    });
  });

  app.get("/contacts", (req, res) => {
    try {
      const result = req.database.exec(`SELECT * FROM contacts`);
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).send("An error occurred while fetching contacts.");
    }
  });

  // Database
  app.get("/database/migrations", AuthGuard, (req, res) => {
    const result = req.database.exec(`SELECT * FROM migrations`);
    res.json(result);
  });

  app.get("/database/tables", AuthGuard, (req, res) => {
    const result = req.database.exec(`SELECT name FROM sqlite_master WHERE type='table'`);
    res.json(result);
  });

  app.get("/whoami", (req, res) => {
    res.json({
      caller: ic.caller(),
      principal: ic.caller().toString(),
    });
  });

  return app.listen();
}

// CreateServer();
