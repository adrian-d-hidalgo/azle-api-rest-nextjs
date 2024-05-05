import { ic } from "azle";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import { readFileSync, writeFileSync } from "fs";

import { Database } from "./database";

async function CreateApp() {
  const database = new Database();
  await database.init();
  await database.migrate();

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

  app.post("/contacts", async (req, res) => {
    console.log({ body: req.body });
    const result = await req.database.exec(`INSERT INTO contacts (name) VALUES ('${req.body.name}')`);
    res.json(result);
  });

  app.get("/contacts", async (req, res) => {
    try {
      const result = await req.database.exec(`SELECT * FROM contacts`);
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).send("An error occurred while fetching contacts.");
    }
  });

  // Database
  app.get("/database/migrations", async (req, res) => {
    const result = await req.database.exec(`SELECT * FROM migrations`);
    res.json(result);
  });

  app.get("/database/tables", async (req, res) => {
    const result = await req.database.exec(`SELECT name FROM sqlite_master WHERE type='table'`);
    res.json(result);
  });

  app.post("/write-file-sync", (req: Request<any, any, { files: [string, string][] }>, res) => {
    console.log(req.body.files);

    req.body.files.forEach(([filename, contents]) => {
      writeFileSync(filename, contents);
    });

    res.send(`No. files written: ${req.body.files.length}`);
  });

  app.get("/read-file-sync", (req: Request<any, any, any, { filename: string }>, res) => {
    try {
      console.log(req.query.filename);
      const contents = readFileSync(req.query.filename);
      console.log(contents);
    } catch (error) {
      console.error(error);
    }

    res.send();
  });

  app.listen();
}

CreateApp();
