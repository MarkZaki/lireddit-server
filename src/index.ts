import { MikroORM } from "@mikro-orm/core";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { config as dotenv } from "dotenv";
import mikroConfig from "./mikro-orm.config";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";

dotenv();

const main = async () => {
	const orm = await MikroORM.init(mikroConfig);
	await orm.getMigrator().up();

	const app = express();

	const apolloServer = new ApolloServer({
		schema: await buildSchema({
			resolvers: [PostResolver, UserResolver],
			validate: false
		}),
		context: () => ({ db: orm.em })
	});

	apolloServer.applyMiddleware({ app });

	app.listen(process.env.PORT, () => console.log("Server Running..."));
};

main().catch(err => console.log(err));
