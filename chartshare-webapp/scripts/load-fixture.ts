import * as fs from "fs";
import * as path from "path";

const FIXTURES_DIR = path.resolve(__dirname, "../cypress/fixtures/databases");
const DB_PATH = path.resolve(__dirname, "../sqlite.db");
const INVALIDATE_URL = "http://localhost:3000/api/test-invalidate-cache";

function available(): string[] {
  return fs
    .readdirSync(FIXTURES_DIR)
    .filter((f) => f.endsWith(".db"))
    .map((f) => f.replace(/\.db$/, ""));
}

const fixture = process.argv[2];

if (!fixture) {
  console.log("Usage: pnpm db:load-fixture <fixture-name>\n");
  console.log("Available fixtures:");
  available().forEach((f) => console.log(`  ${f}`));
  process.exit(1);
}

const fixturePath = path.join(FIXTURES_DIR, `${fixture}.db`);

if (!fs.existsSync(fixturePath)) {
  console.error(`Error: fixture '${fixture}' not found\n`);
  console.log("Available fixtures:");
  available().forEach((f) => console.log(`  ${f}`));
  process.exit(1);
}

async function loadFixture() {
  // Close the server's db connection before swapping the file
  try {
    const closeRes = await fetch(`${INVALIDATE_URL}?action=close`);
    if (closeRes.ok) console.log("Server db connection closed");
  } catch {
    // Server not running, that's fine
  }

  for (const suffix of ["-wal", "-shm"]) {
    const p = DB_PATH + suffix;
    if (fs.existsSync(p)) fs.unlinkSync(p);
  }

  fs.copyFileSync(fixturePath, DB_PATH);
  console.log(`Loaded fixture: ${fixture}`);

  // Reopen db connection and invalidate cache
  try {
    const res = await fetch(INVALIDATE_URL);
    if (res.ok) console.log("Server db reopened and cache invalidated");
    else console.log("Dev server responded but invalidation failed (is TEST_MODE set?)");
  } catch {
    console.log("Dev server not running, skipping cache invalidation");
  }
}

loadFixture();
