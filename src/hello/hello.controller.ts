import { Controller, Get, Param, Query } from '@nestjs/common';
import { HelloService } from './hello.service';

@Controller('hello')
export class HelloController {
  constructor(private readonly helloService:HelloService) { }

  @Get('get-hello')
  getHello():string {
    return this.helloService.getHello();
  }

  @Get('user/:name')
  getUserHello(@Param('name') name: string):string{
    return this.helloService.getUserHello(name);
  }

  @Get('query')
  getUserQuery(@Query('name') name: string):string{
    return this.helloService.getUserHello(name);
  }
}
