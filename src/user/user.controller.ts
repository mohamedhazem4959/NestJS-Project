import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { Throttle } from '@nestjs/throttler';

@Controller('user')
export class UserController {

  constructor(private readonly userService: UserService) { }

  @Get()
  getAllUsers(){
    return this.userService.getAllUsers();
  }

  @Throttle({ default: { limit: 1, ttl: 1000 } })
  @Get(':id')
  async getOneUser(@Param('id', ParseIntPipe) id: number){
    return this.userService.getOneUserById(id);
  }

  @Get('hello/:id')
  getWelcomeById(@Param('id', ParseIntPipe) id: number){
    return this.userService.getWelcomeMessage(id);
  }


}
