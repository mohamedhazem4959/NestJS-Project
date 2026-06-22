import { Module } from '@nestjs/common';
import { AgeController } from './age.controller';
import { AgeService } from './age.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [UserModule],
  controllers: [AgeController],
  providers: [AgeService]
})
export class AgeModule {}
