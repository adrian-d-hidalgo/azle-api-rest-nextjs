import { Server, init, postUpgrade, preUpgrade, setNodeServer } from "azle";
import "reflect-metadata";

import { Database, DatabaseOptions } from "./database";
import { ENTITIES } from "./database/entities";
import { ConsoleLogger } from "./database/logger";
import { DatabaseStorage } from "./database/storage";
import { CreateServer } from "./server";

const databaseOptions: DatabaseOptions = {
  sincronize: false,
  migrationsRun: true,
  storage: new DatabaseStorage({
    key: "DATABASE",
    index: 0,
  }),
  entities: ENTITIES,
  // TODO: Migrations are not found
  migrations: ["/migrations/*.{ts,js}"],
  // TODO: logger not working,
  logger: new ConsoleLogger(false),
};

let db: Database | undefined;

export default Server(
  async () => {
    console.log("Server method called");
    db = new Database(databaseOptions);
    await db.load();
    return CreateServer({ database: db });
  },
  {
    init: init([], async () => {
      console.log("Init method called");
      try {
        db = new Database(databaseOptions);
        await db.init();
        setNodeServer(CreateServer({ database: db }));
      } catch (error) {
        console.error("Error initializing database:", error);
        throw error;
      }
    }),
    // TODO: This method is not called
    preUpgrade: preUpgrade(() => {
      console.log("PreUpgrade method called");
      try {
        if (!db) {
          throw new Error("Database not initialized");
        }

        db.save();
      } catch (error) {
        console.error("Error saving database:", error);
      }
    }),
    postUpgrade: postUpgrade([], async () => {
      console.log("PostUpgrade method called");
      try {
        db = new Database(databaseOptions);
        await db.load();
        setNodeServer(CreateServer({ database: db }));
      } catch (error) {
        console.error("Error loading database:", error);
      }
    }),
  }
);
