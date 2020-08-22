import { config as dotenv } from "dotenv";
import { MikroORM } from "@mikro-orm/core";

dotenv();

const main = async () => {
	const { DB_NAME, DB_USER, DB_PASSWORD } = process.env;
	const orm = await MikroORM.init({
		dbName: DB_NAME,
		user: DB_USER,
		password: DB_PASSWORD
	});
};

main();
