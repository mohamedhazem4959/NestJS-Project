import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { HashingService } from './hashing/hashing.service';
import { JwtService } from '@nestjs/jwt';
import { createUserDto } from 'src/user/user.schema';
import { googleSignUpDto } from './auth.schema';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private hashingService: HashingService,
        private jwtService: JwtService
    ) { }

    async signIn(email: string, password: string | null): Promise<{ access_token: string }> {
        const user = await this.userService.getOneUserByEmail(email);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        if (password !== null && user.password) {
            const comparePassword = await this.hashingService.compare(password, user.password);
            if (!comparePassword) {
                throw new UnauthorizedException('Invalid credentials');
            }
        }

        const payload = { sub: user.id, email: user.email, role: user.role };
        // return JWT in future
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }

    async singUp(user: createUserDto) {
        const hashedPassword = await this.hashingService.hash(user.password);
        const newUser = await this.userService.createUser(user.name, user.email, hashedPassword);
        const { password, ...result } = newUser;
        return result;
    }

    async GoogleSignUp(googleUser: googleSignUpDto) {
        try {
            const newUser = await this.userService.createUser(googleUser.firstName + ' ' + googleUser.lastName, googleUser.email, null, googleUser.googleId);
            const { password, ...result } = newUser;
            return this.signIn(googleUser.email, null);
        } catch (error) {
            throw new UnauthorizedException('Error occurred while signing up with Google');
        }
    }

    async checkUserExists(email: string): Promise<boolean> {
        try {
            const user = await this.userService.getOneUserByEmail(email);
            return true;
        } catch (error: any) {
            const isNotFound = 
                error.statusCode === 404 ||
                error.response?.message === 'User not found';
                error.status === 404;
            if (isNotFound) {
                return false;
            }
            throw error;
        }
        
    }
}
