import { defineConfig } from "cypress";
import * as fs from "fs-extra";
import * as path from "path";
import { execSync } from "child_process";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: 10000,
    specPattern: "cypress/e2e/**/*.cy.ts",
    setupNodeEvents(on) {
      // Database fixture management tasks
      on("task", {
        async loadDbFixture(fixtureName: string) {
          const fixtureDbPath = path.resolve(
            __dirname,
            "cypress/fixtures/databases",
            `${fixtureName}.db`,
          );
          const targetDbPath = path.resolve(__dirname, "sqlite.db");

          if (await fs.pathExists(fixtureDbPath)) {
            // Remove WAL/SHM journal files so SQLite starts fresh
            await fs.remove(`${targetDbPath}-wal`);
            await fs.remove(`${targetDbPath}-shm`);
            await fs.copy(fixtureDbPath, targetDbPath, { overwrite: true });
          } else {
            throw new Error(`Fixture database not found: ${fixtureDbPath}`);
          }

          return null;
        },

        async saveDbFixture(fixtureName: string) {
          const sourceDbPath = path.resolve(__dirname, "sqlite.db");
          const fixtureDbPath = path.resolve(
            __dirname,
            "cypress/fixtures/databases",
            `${fixtureName}.db`,
          );
          const fixtureDir = path.dirname(fixtureDbPath);

          // Ensure the fixtures directory exists
          await fs.ensureDir(fixtureDir);

          if (await fs.pathExists(sourceDbPath)) {
            await fs.copy(sourceDbPath, fixtureDbPath, { overwrite: true });
          } else {
            throw new Error(`Source database not found: ${sourceDbPath}`);
          }

          return null;
        },

        async resetDb() {
          const dbPath = path.resolve(__dirname, "sqlite.db");
          const fixtureDbPath = path.resolve(
            __dirname,
            "cypress/fixtures/databases",
            "empty.db",
          );

          if (await fs.pathExists(fixtureDbPath)) {
            // Remove WAL/SHM journal files so SQLite starts fresh
            await fs.remove(`${dbPath}-wal`);
            await fs.remove(`${dbPath}-shm`);
            await fs.copy(fixtureDbPath, dbPath, { overwrite: true });
          } else {
            throw new Error(
              "empty.db fixture not found. Run 'pnpm cypress:fixtures' to generate it.",
            );
          }

          return null;
        },

        async generateEmptyDb() {
          const dbPath = path.resolve(__dirname, "sqlite.db");

          // Remove existing db and journal files so db:push creates a fresh one
          await fs.remove(dbPath);
          await fs.remove(`${dbPath}-wal`);
          await fs.remove(`${dbPath}-shm`);

          execSync("pnpm db:push", {
            cwd: __dirname,
            stdio: "inherit",
          });

          return null;
        },
      });
    },
  },
});
