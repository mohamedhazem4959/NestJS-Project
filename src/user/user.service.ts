import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { HelloService } from '../hello/hello.service';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UserService {

    constructor(private readonly helloService: HelloService, private readonly prisma: PrismaService) { }

    async getAllUsers(){
        return this.prisma.users.findMany();
    }

    async getOneUserById(id: number){
        const user = await this.prisma.users.findUnique({ where: { id } });
        if(!user){
            throw new NotFoundException('User not found');
        }
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
