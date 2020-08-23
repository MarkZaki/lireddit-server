import { User } from "../entities/User";
import { MyContext } from "../types";
import { Arg, Ctx, Field, InputType, Mutation, Resolver } from "type-graphql";
import argon2 from "argon2";

@InputType()
class UsernamePasswordInput {
	@Field()
	username: string;

	@Field()
	password: string;
}

@Resolver()
export class UserResolver {
	@Mutation(() => User)
	async register(
		@Ctx() { db }: MyContext,
		@Arg("options", () => UsernamePasswordInput)
		{ username, password }: UsernamePasswordInput
	): Promise<User> {
		const hashedPassword = await argon2.hash(password);
		const user = db.create(User, { username, password: hashedPassword });
		await db.persistAndFlush(user);
		return user;
	}
}
