import initSqlJs, { Database as SqlJsDatabase } from "sql.js/dist/sql-asm.js";
import { DataSource, EntitySchema, Logger, MixedList } from "typeorm";

import { DatabaseStorage, DatabaseStorageInterface } from "./storage";

export type DatabaseOptions = {
  storage: DatabaseStorageInterface;
  migrations?: MixedList<string | Function>;
  entities?: MixedList<string | Function | EntitySchema<any>>;
  sincronize?: boolean;
  migrationsRun?: boolean;
  logging?: boolean;
  logger?: "advanced-console" | "simple-console" | "file" | "debug" | Logger | undefined;
};

export const DatabaseDefaults = {
  storage: new DatabaseStorage(),
};

export class Database {
  private dataSource: DataSource | undefined;
  private storage: DatabaseStorageInterface;

  constructor(private options: DatabaseOptions = DatabaseDefaults) {
    this.storage = this.options.storage;
  }

  private async connect(bytes: Uint8Array) {
    const AppDataSource = new DataSource({
      type: "sqljs",
      // TODO: may I get this from the options?
      driver: await initSqlJs({}),
      database: bytes,
      synchronize: this.options.sincronize,
      entities: this.options.entities,
      migrations: this.options.migrations,
      migrationsRun: this.options.migrationsRun,
      logging: this.options.logging,
      logger: this.options.logger,
    });

    const dataSource = await AppDataSource.initialize();

    return dataSource;
  }

  public async init() {
    try {
      this.options.sincronize = true;
      this.dataSource = await this.connect(Uint8Array.from([]));
    } catch (error) {
      console.error("Error initializing database:", error);
      throw error;
    }
  }

  public async load() {
    try {
      const data = (await this.storage.get()) || Uint8Array.from([]);

      if (data.length === 0) {
        this.options.sincronize = true;
        console.log("Empty database found in storage");
      }

      this.dataSource = await this.connect(data);
    } catch (error) {
      console.error("Error initializing database:", error);
      throw error;
    }
  }

  public async save() {
    if (!this.dataSource) {
      throw new Error("Database not initialized");
    }

    const driver = this.dataSource.driver as unknown as SqlJsDatabase;

    const data = driver.export();
    await this.storage.set(data);
  }

  public async getDataSource() {
    if (!this.dataSource) {
      throw new Error("Database not initialized");
    }

    return this.dataSource;
  }
}
