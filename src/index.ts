import { config as dotenv } from "dotenv";
import { MikroORM } from "@mikro-orm/core";
import mikroConfig from "./mikro-orm.config";

dotenv();

const main = async () => {
	const orm = await MikroORM.init(mikroConfig);
	await orm.getMigrator().up();
};

main().catch(err => console.log(err));
