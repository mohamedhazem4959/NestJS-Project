import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { type createPostDto } from './posts.schema';
import { PrismaService } from "../prisma.service";
import { Prisma } from 'src/generated/prisma/browser';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { FindPostsQueryDto } from 'src/common/dto/find-posts-query.dto';
import { PaginatedResponse } from 'src/common/interfaces/pagination-interface';
import { Post } from 'src/generated/prisma/browser';
@Injectable()
export class PostsService {

    private postListCacheKey: Set<string> = new Set();
    constructor(private readonly prisma: PrismaService,
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache
    ) { }

    // private posts = [
    //     { id: 1, title: 'First Post', content: 'This is the first post', authorName: 'John Doe', createdAt: new Date(), updatedAt: new Date() },

    //     { id: 2, title: 'Second Post', content: 'This is the second post', authorName: 'Alice', createdAt: new Date(), updatedAt: new Date() },
    // ];

    private generatePostsListCacheKey(query: FindPostsQueryDto): string {
        const { page=1, limit = 10, title } = query;
        let cacheKey = `posts:page=${page}:limit=${limit}:title=${title || 'all'}`;
        return cacheKey;
    }

    async findAll(query: FindPostsQueryDto): Promise<PaginatedResponse<Post>> {
        const cacheKey = this.generatePostsListCacheKey(query);

        this.postListCacheKey.add(cacheKey);

        const cachedPosts = await this.cacheManager.get<PaginatedResponse<Post>>(cacheKey);
        if (cachedPosts) {
            console.log('Returning cached posts');
            return cachedPosts;
        }

        console.log('Fetching posts from database');
        const { page = 1, limit = 10, title } = query;
        const skip = (page - 1) * limit;

        const whereClause: Prisma.PostWhereInput = title ? { title: { contains: title, mode: 'insensitive' } } : {};

        const [items, totalItems] = await Promise.allSettled([
            this.prisma.post.findMany({
                where: whereClause,
                skip,
                take: limit,
            }),
            this.prisma.post.count({ where: whereClause }),
        ]);
        
        const totalPages = Math.ceil(totalItems.status === 'fulfilled' ? totalItems.value : 0 / limit);
        const hasNextPage = page < totalPages;
        const hasPreviousPage = page > 1;


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