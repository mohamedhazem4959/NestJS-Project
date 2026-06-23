import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { HashingService } from './hashing/hashing.service';
import { JwtService } from '@nestjs/jwt';
import { createUserDto } from 'src/user/user.schema';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private hashingService: HashingService,
        private jwtService: JwtService
    ) {}

    async signIn(email: string, password: string): Promise<{access_token: string}> {
        const user = await this.userService.getOneUserByEmail(email);
        const comparePassword = await this.hashingService.compare(password, user.password);
        if (!comparePassword) {
            throw new NotFoundException('Invalid credentials');
        }

        const payload = { sub: user.id, email: user.email };
        // return JWT in future
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }

    async singUp(user: createUserDto){
        const hashedPassword = await this.hashingService.hash(user.password);
        const newUser = await this.userService.createUser(user.name, user.email, hashedPassword); 
        const { password, ...result } = newUser;
        return result;
    }
}
