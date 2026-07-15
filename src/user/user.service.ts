import { Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { HelloService } from '../hello/hello.service';
import { PrismaService } from 'src/prisma.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class UserService {

    constructor(private readonly helloService: HelloService, private readonly prisma: PrismaService,
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache
    ) { }

    async getAllUsers(){
        return this.prisma.users.findMany();
    }

    async getOneUserById(id: number){
        const cacheKey = `user:${id}`;
        const cachedUser: any = await this.cacheManager.get(cacheKey);
        if (cachedUser) {
            return cachedUser;
        }

        const user = await this.prisma.users.findUnique({ where: { id } });
        if(!user){
            throw new NotFoundException('User not found');
        }
        await this.cacheManager.set(cacheKey, user, 10000); // Cache for 10 seconds
        return user;
    }

    async getOneUserByEmail(email: string){
        const user = await this.prisma.users.findUnique({ where: { email } });
        if(!user){
            throw new NotFoundException('User not found');
        }
        return user;
    }

    async getWelcomeMessage(id: number): Promise<string>{
        const user = await this.getOneUserById(id);
        if(!user){
          throw new NotFoundException('User not found');
        }
        return this.helloService.getUserHello(user.name);
    }

    async createUser(name: string, email: string, password: string | null, googleId?: string){
        const existingUser = await this.prisma.users.findUnique({ where: { email } });
        if(existingUser){
            throw new UnauthorizedException('Invalid credentials');
        }
        return this.prisma.users.create({
            data: {
                name,
                email,
                password,
                googleId,
            },
        });
    }

}
