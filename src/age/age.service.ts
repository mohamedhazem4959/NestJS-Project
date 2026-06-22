import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AgeService {

    constructor( private readonly userService: UserService ) { }

    returnAge (id: number, age: number) {
        const user = this.userService.getUserById(id);
        return `User ${user.name} id ${age} years old`;
    }
}
