import path from "path";
import { config } from "dotenv";
config();
import { MikroORM } from "@mikro-orm/core";
import { Post } from "./entities/Post";
import { __prod__ } from "./constants";

export default {
	type: "mariadb",
	dbName: process.env.DB_NAME,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	debug: !__prod__,
	entities: [Post],
	migrations: {
		path: path.join(__dirname, "./migrations"),
		pattern: /^[\w-]+\d+\.[tj]s$/
	}
} as Parameters<typeof MikroORM.init>[0];
