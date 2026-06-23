import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AgeService {

    constructor( private readonly userService: UserService ) { }

    async returnAge (id: number, age: number) {
        const user = await this.userService.getOneUserById(id);
        return `User ${user.name} id ${age} years old`;
    }
}
