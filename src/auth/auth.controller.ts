import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { signInDto, signInSchema } from './auth.schema';
import { ZodValidationPipe } from 'src/common/pipes/zod.validation.pipe';
import { createUserDto, createUserSchema } from 'src/user/user.schema';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    async signIn(@Body(new ZodValidationPipe(signInSchema)) body: signInDto): Promise<{ access_token: string }> {
        return this.authService.signIn(body.email, body.password);
    }

    @Post('register')
    async signUp(@Body(new ZodValidationPipe(createUserSchema)) body: createUserDto) {
        return this.authService.singUp(body);
    }

    @UseGuards(AuthGuard)
    @Get('profile')
    async getProfile(@Request() req) {
        return req.user;
    }
}
