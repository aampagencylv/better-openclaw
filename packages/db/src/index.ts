import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema.js";

//const connectionString = process.env.DATABASE_URL;
const connectionString = "postgresql://TGzrsWnFj2lOp0pn:bTdEQ37F4LpDOXeXz3mwlxlO6PbupJMK@109.199.125.166:2345/better_openclaw";
if (!connectionString) {
	throw new Error("DATABASE_URL environment variable is required");
}

const client = postgres(connectionString, { max: 10 });
export const db = drizzle(client, { schema });

export * from "./schema.js";
export { schema };
