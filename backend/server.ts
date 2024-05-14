import { ic } from "azle";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";

import { Database } from "./database";
import { UserEntity } from "./database/entities/user";

export type CreateServerOptions = {
  database: Database;
};

export function CreateServer({ database }: CreateServerOptions) {
  const app = express();

  app.use(cors());
  app.use(express.json());

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

  app.get("/users", async (req, res) => {
    const dataSource = await database.getDataSource();
    const userRepository = dataSource.getRepository(UserEntity);
    const users = await userRepository.find();
    res.json(users);
  });

  app.get("/users/me", AuthGuard, async (req, res) => {
    try {
      const dataSource = await database.getDataSource();
      const userRepository = dataSource.getRepository(UserEntity);
      const user = await userRepository.findOneBy({ principal: ic.caller().toString() });

      if (!user) {
        res.status(404);
        res.send("User not found.");
      } else {
        res.json(user);
      }
    } catch (error: any) {
      res.status(400);
      res.send(error.message);
    }
  });

  app.get("/users/:id", async (req, res) => {
    try {
      const dataSource = await database.getDataSource();
      const userRepository = dataSource.getRepository(UserEntity);
      const user = await userRepository.findOneBy({ id: req.body.id });

      if (!user) {
        res.status(404);
        res.send("User not found.");
      } else {
        res.json(user);
      }
    } catch (error: any) {
      res.status(400);
      res.send(error.message);
    }
  });

  app.post("/users", AuthGuard, async (req: Request, res) => {
    try {
      const dataSource = await database.getDataSource();
      const userRepository = dataSource.getRepository(UserEntity);

      const newUser = {
        principal: ic.caller().toString(),
        username: req.body.username,
        bio: req.body.bio,
      };

      const user = await userRepository.save(newUser);
      res.json(user);
    } catch (error: any) {
      res.status(400);
      res.send(error.message);
    }
  });

  return app.listen();
}
