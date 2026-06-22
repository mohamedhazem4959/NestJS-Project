import { Injectable } from '@nestjs/common';

@Injectable()
export class HelloService {

  getHello():string {
    return "Hello from NestJS";
  }

  getUserHello(name: string):string {
    return `hello ${name} from NestJS`;
  }
}
