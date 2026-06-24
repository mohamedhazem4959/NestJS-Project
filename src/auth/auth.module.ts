import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { HashingModule } from './hashing/hashing.module';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { HashingService } from './hashing/hashing.service';
import { GoogleStrategy } from './google.strategy';

@Module({
  imports: [
      UserModule,
      JwtModule.register({
        global: true,
        secret: jwtConstants.secret,
        signOptions: { expiresIn: '15m' },
      })
    ],
  providers: [AuthService, HashingService, GoogleStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
