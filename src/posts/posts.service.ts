import { Injectable, NotFoundException } from '@nestjs/common';
import { type createPostDto } from './posts.schema';
import { PrismaService } from "../prisma.service";
@Injectable()
export class PostsService {

    constructor(private readonly prisma: PrismaService) { }

    private posts = [
        { id: 1, title: 'First Post', content: 'This is the first post', authorName: 'John Doe', createdAt: new Date(), updatedAt: new Date() },

        { id: 2, title: 'Second Post', content: 'This is the second post', authorName: 'Alice', createdAt: new Date(), updatedAt: new Date() },
    ];

    async findAll(where?: {}): Promise<createPostDto[]> {
        const posts: createPostDto[] = await this.prisma.post.findMany({ where: where });
        return posts;
    }

    async findOne(id: number): Promise<createPostDto> {
        const post = await this.prisma.post.findUnique({ where: { id } });
        if (!post) {
            throw new NotFoundException(`Post with id ${id} not found`);
        }
        return post;
    }

    async addPost(post: createPostDto) {
        try {
            const newPost = await this.prisma.post.create({ data: post });
            return newPost;
        } catch (error) {
            throw new Error('Failed to add post', { cause: error });
        }
    }

    async deletePost(id: number) {
        const post = await this.prisma.post.delete({ where: { id } });
        if (!post) {
            throw new NotFoundException(`Post with id ${id} not found`);
        }
        return post;
    }

    async updatePost(id: number, updatedPost: Partial<createPostDto>) {
        const post = await this.prisma.post.update({ where: { id }, data: updatedPost });
        if (!post) {
            throw new NotFoundException(`Post with id ${id} not found`);
        }
        return post;
    }
}