import { Null, Opt, Record, Variant, Vec, int, int64, text } from "azle";
import { existsSync, readFileSync, writeFileSync } from "fs";
import initSqlJs from "sql.js/dist/sql-asm.js";

import { migrations } from "./migrations";

export const MigrationStatus = Variant({
  Pending: Null,
  Applied: Null,
});

export const Migration = Record({
  id: int64,
  status: MigrationStatus,
  queries: Vec(text),
  createdAt: int,
  appliedAt: Opt(int),
});

export type Migration = typeof Migration.tsType;

export interface DatabaseInterface {
  init(): Promise<void>;
  migrate(): Promise<void>;
  exec(sql: string): initSqlJs.QueryExecResult[];
}

const DB_FILE = "database.sql";

export class Database implements DatabaseInterface {
  private db: initSqlJs.Database | undefined;

  public async init(): Promise<void> {
    try {
      const SQL = await initSqlJs({});
      if (existsSync(DB_FILE)) {
        console.log("Database file found:", DB_FILE);
        const fileBuffer = readFileSync(DB_FILE);
        this.db = new SQL.Database(fileBuffer);
      } else {
        console.log("Database file not found:", DB_FILE);
        this.db = new SQL.Database();
      }
    } catch (error) {
      console.error("Error initializing database:", error);
      throw error;
    }
  }

  public async migrate() {
    if (!this.db) {
      throw new Error("Database not initialized");
    }

    try {
      this.run(`
                CREATE TABLE IF NOT EXISTS migrations (
                    id INTEGER PRIMARY KEY,
                    name TEXT UNIQUE,
                    created_at INTEGER DEFAULT (strftime('%s', 'now'))
                );
            `);

      const { columns, values } = this.db.exec("SELECT * FROM migrations;")[0] || {};
      let executedMigrationNames: string[] = [];

      if (columns && values) {
        const nameIndex = columns.indexOf("name");

        executedMigrationNames = values.map((row: any) => {
          return row[nameIndex];
        });
      }

      const newMigrationNames = Array.from(migrations.keys()).filter((name) => {
        return !executedMigrationNames.includes(name);
      });

      const migrationQueries = newMigrationNames
        .flatMap((name) => {
          return migrations.get(name)?.queries || [];
        })
        .join("");

      this.exec(migrationQueries);

      // TODO: revert migration if error occurs, maybe use transactions
      const saveMigrationsQuery = `
                INSERT INTO migrations (name) 
                VALUES 
                    ${newMigrationNames.map((name) => `('${name}')`).join(", ")}
            `;

      this.run(saveMigrationsQuery);
    } catch (error) {
      console.error("Error migrating database:", error);
      throw error;
    }
  }

  private saveDatabaseChanges() {
    if (!this.db) {
      throw new Error("Database not initialized");
    }

    try {
      const data = this.db.export();
      const buffer = Buffer.from(data);
      writeFileSync(DB_FILE, buffer);
    } catch (error) {
      console.error("Error saving database:", error);
      throw error;
    }
  }

  public exec(sql: string, params?: initSqlJs.BindParams): initSqlJs.QueryExecResult[] {
    if (!this.db) {
      throw new Error("Database not initialized");
    }

    try {
      const result = this.db.exec(sql, params);
      this.saveDatabaseChanges();
      return result;
    } catch (error) {
      console.error("Error saving database:", error);
      throw error;
    }
  }

  public run(sql: string, params?: initSqlJs.BindParams): void {
    if (!this.db) {
      throw new Error("Database not initialized");
    }

    try {
      this.db.run(sql, params);
      this.saveDatabaseChanges();
    } catch (error) {
      console.error("Error running query:", error);
      throw error;
    }
  }
}
