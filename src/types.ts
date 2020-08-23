import { EntityManager, IDatabaseDriver, Connection } from "@mikro-orm/core";

export type MyContext = {
	db: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>;
};
