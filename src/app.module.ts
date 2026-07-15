import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HelloModule } from './hello/hello.module';
import { UserModule } from './user/user.module';
import { AgeModule } from './age/age.module';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { PostsModule } from './posts/posts.module';
import { PrismaService } from './prisma.service';
import { AuthModule } from './auth/auth.module';
import { AuthGuard } from './auth/auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import { CacheModule } from '@nestjs/cache-manager';
import KeyvRedis from '@keyv/redis';
@Module({
  imports: [
      ConfigModule.forRoot({
        isGlobal: true,
      }),
      ThrottlerModule.forRoot({
        throttlers:[
          {
            ttl: 60000,
            limit: 10
          }
        ]
      }),
      CacheModule.register({
        isGlobal: true,
        stores: [
          new KeyvRedis('redis://localhost:6379')
        ]
      }),
      HelloModule,
      UserModule,
      AgeModule,
      PostsModule,
      AuthModule,
    ],
  controllers: [AppController],
  providers: [AppService, PrismaService,
    { provide: 'APP_GUARD', useClass: AuthGuard },
    { provide: 'APP_GUARD', useClass: RolesGuard },
    { provide: 'APP_GUARD', useClass: ThrottlerGuard }
  ],
})
export class AppModule {}
