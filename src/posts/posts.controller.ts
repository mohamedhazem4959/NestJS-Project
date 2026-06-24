import { Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { createPostSchema, type createPostDto } from './posts.schema';
import { ZodValidationPipe } from 'src/common/pipes/zod.validation.pipe';
import { Roles } from 'src/auth/decorator/role.decorator';
import { use } from 'passport';
import { AuthGuard } from 'src/auth/auth.guard';
import { Role } from 'src/generated/prisma/enums';

@Controller('posts')
export class PostsController {

    constructor(private readonly postsService: PostsService) { }

    @Get()
    findAllPosts(@Query('search') search?: string): Promise<createPostDto[]> {
        if (search) {
            return this.postsService.findAll({ title: { contains: search } });
        }
        return this.postsService.findAll();
    }

    @Get(':id')
    findOnePost(@Param('id', ParseIntPipe) id: number): Promise<createPostDto> {
        return this.postsService.findOne(id);
    }

    @UseGuards(AuthGuard)
    @Roles(Role.ADMIN)
    @Post()
    addPost(@Body(new ZodValidationPipe(createPostSchema)) post: createPostDto): Promise<createPostDto>{
        return this.postsService.addPost(post); 
    }

    @Delete(':id')
    deletePost(@Param('id', ParseIntPipe) id: number) {
        return this.postsService.deletePost(id);
    }

    @Put(':id')
    updatePost(@Param('id', ParseIntPipe) id: number, @Body(new ZodValidationPipe(createPostSchema)) updatedPost: Partial<createPostDto>) {
        return this.postsService.updatePost(id, updatedPost);
    }

}
