import { Injectable, NotFoundException } from '@nestjs/common';
import { HelloService } from '../hello/hello.service';

@Injectable()
export class UserService {

    constructor(private readonly helloService: HelloService) { }

    getAllUsers(){
        return [
          {id: 1, name: 'mohamed'},
          {id: 2, name: 'hazem'},
          {id: 3, name: 'mokhtar'}
        ]
    }

    getUserById(id: number){
        const user = this.getAllUsers().find(user => user.id === id);
        if(!user){
          throw new NotFoundException('User not found');
        }
        return user;
    }

    getWelcomeMessage(id: number):string{
        const user = this.getAllUsers().find(user => user.id === id);
        if(!user){
          throw new NotFoundException('User not found');
        }
        return this.helloService.getUserHello(user.name);
    }

}
