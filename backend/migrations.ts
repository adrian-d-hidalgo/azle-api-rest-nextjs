export type MigrationItem = {
    queries: string[];
};

export const migrations = new Map<string, MigrationItem>();

/*
 * Migration name format: YYYY-MM-DD_HHMM_migration_name
 */

/*
 * Migration to create the users table.
 */
migrations.set("2024-05-04_1156_create_users_table", {
    queries: [
        "CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT);",
    ],
});

/*
 * Migration to create the contacts table.
 */

migrations.set("2024-05-04_1159_create_contacts_table", {
    queries: [
        "CREATE TABLE contacts (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT);",
    ],
});
