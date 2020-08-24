import { User } from "../entities/User";
import { MyContext } from "../types";
import {
	Arg,
	Ctx,
	Field,
	InputType,
	Mutation,
	ObjectType,
	Resolver
} from "type-graphql";
import argon2 from "argon2";

@InputType()
class UsernamePasswordInput {
	@Field()
	username: string;

	@Field()
	password: string;
}

@ObjectType()
class FieldError {
	@Field()
	field: string;

	@Field()
	message: string;
}

@ObjectType()
class UserResponse {
	@Field(() => [FieldError], { nullable: true })
	errors?: FieldError[];

	@Field(() => User, { nullable: true })
	user?: User;
}

@Resolver()
export class UserResolver {
	@Mutation(() => UserResponse)
	async register(
		@Ctx() { db }: MyContext,
		@Arg("options", () => UsernamePasswordInput)
		{ username, password }: UsernamePasswordInput
	): Promise<UserResponse> {
		const user = await db.findOne(User, { username });

		if (user) {
			return {
				errors: [
					{
						field: "username",
						message: "username already exists"
					}
				]
			};
		}

		if (username.length <= 2) {
			return {
				errors: [
					{
						field: "username",
						message: "username must be at least 3 characters"
					}
				]
			};
		}
		if (password.length <= 5) {
			return {
				errors: [
					{
						field: "password",
						message: "password must be at least 6 characters"
					}
				]
			};
		}
		const hashedPassword = await argon2.hash(password);
		const newUser = db.create(User, { username, password: hashedPassword });
		await db.persistAndFlush(newUser);
		return { user: newUser };
	}

	@Mutation(() => UserResponse)
	async login(
		@Ctx() { db }: MyContext,
		@Arg("options", () => UsernamePasswordInput)
		{ username, password }: UsernamePasswordInput
	): Promise<UserResponse> {
		const user = await db.findOne(User, { username });
		if (!user) {
			return {
				errors: [{ field: "username", message: "username doesn't exist" }]
			};
		}

		const valid = await argon2.verify(user.password, password);

		if (!valid) {
			return {
				errors: [{ field: "password", message: "wrong password" }]
			};
		}

		return {
			user
		};
	}
}
