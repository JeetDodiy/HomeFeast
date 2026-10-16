import EmbeddedPostgres from "embedded-postgres";
import path from "path";

async function start() {
  const dbDir = path.join(process.cwd(), ".data", "postgres");
  console.log("🐘 Initializing PostgreSQL cluster at:", dbDir);

  const pg = new EmbeddedPostgres({
    databaseDir: dbDir,
    user: "postgres",
    password: "password",
    port: 5432,
    persistent: true,
  });

  await pg.initialise();
  console.log("✓ Initialised cluster");

  await pg.start();
  console.log("✓ PostgreSQL server started on port 5432");

  try {
    await pg.createDatabase("homefeast");
    console.log("✓ Created database 'homefeast'");
  } catch (err) {
    console.log("Database 'homefeast' already exists or ready:", err.message);
  }

  console.log("🐘 PostgreSQL is ready! Connection URL: postgresql://postgres:password@localhost:5432/homefeast?schema=public");
}

start().catch((err) => {
  console.error("Failed to start PostgreSQL:", err);
  process.exit(1);
});
