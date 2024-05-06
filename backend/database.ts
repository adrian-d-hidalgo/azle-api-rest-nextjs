import { Null, Opt, Record, StableBTreeMap, Variant, Vec, int, int64, stableJson, text } from "azle";
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
  migrate(): void;
  exec(sql: string): initSqlJs.QueryExecResult[];
}

export class Database implements DatabaseInterface {
  private db: initSqlJs.Database | undefined;
  private storage = StableBTreeMap<"DATABASE", Uint8Array>(0, stableJson, {
    toBytes: (data: Uint8Array) => data,
    fromBytes: (bytes: Uint8Array) => bytes,
  });

  public async init(): Promise<void> {
    try {
      const SQL = await initSqlJs({});
      const backup = this.storage.get("DATABASE").Some || undefined;

      if (backup) {
        console.log("Database found in storage");
        this.db = new SQL.Database(backup);
        console.log("Database restored from storage", this.db.getRowsModified());
      } else {
        console.log("Database not found in storage, initializing new database");
        this.db = new SQL.Database(Uint8Array.from([]));
        console.log("Database restored from array", this.db.getRowsModified());
      }

      console.log("Database migration started");
      this.migrate();
      console.log("Database migration completed");
    } catch (error) {
      console.error("Error initializing database:", error);
      throw error;
    }
  }

  public migrate() {
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

      console.log("Migrations table created successfully");

      const { columns, values } = this.exec("SELECT * FROM migrations;")[0] || {};
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

      if (newMigrationNames.length === 0) {
        console.log("No new migrations found");
        return;
      }

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
      // TODO: Save only if changes were made
      const backup = this.db.export();
      this.storage.insert("DATABASE", backup);
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
      console.log("Executed query:", sql);
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
