import { Post } from "../entities/Post";
import { MyContext } from "../types";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";

@Resolver()
export class PostResolver {
	@Query(() => [Post])
	posts(@Ctx() { db }: MyContext): Promise<Post[]> {
		return db.find(Post, {});
	}

	@Query(() => Post, { nullable: true })
	post(@Ctx() { db }: MyContext, @Arg("id") id: number): Promise<Post | null> {
		return db.findOne(Post, { id });
	}

	@Mutation(() => Post)
	async createPost(
		@Ctx() { db }: MyContext,
		@Arg("title") title: string
	): Promise<Post> {
		const post = db.create(Post, { title });
		await db.persistAndFlush(post);
		return post;
	}

	@Mutation(() => Post, { nullable: true })
	async updatePost(
		@Ctx() { db }: MyContext,
		@Arg("id") id: number,
		@Arg("title") title: string
	): Promise<Post | null> {
		const post = await db.findOne(Post, { id });
		if (!post) return null;
		if (typeof title !== "undefined") {
			post.title = title;
			await db.persistAndFlush(post);
		}
		return post;
	}

	@Mutation(() => Boolean)
	async deletePost(
		@Ctx() { db }: MyContext,
		@Arg("id") id: number
	): Promise<boolean> {
		await db.nativeDelete(Post, { id });
		return true;
	}
}
