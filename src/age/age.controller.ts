import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { AgeService } from './age.service';

@Controller('age')
export class AgeController {

    constructor( private readonly ageService: AgeService ) { }

    @Post(':id')
    getAge (@Param('id', ParseIntPipe) id: number, @Body('age') age: number) {
        return this.ageService.returnAge(id, age);
    }
}
