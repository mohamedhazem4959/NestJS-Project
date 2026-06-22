import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HelloModule } from './hello/hello.module';
import { UserModule } from './user/user.module';
import { AgeModule } from './age/age.module';
import { ConfigModule } from '@nestjs/config';
import { PostsModule } from './posts/posts.module';
import { PrismaService } from './prisma.service';

@Module({
  imports: [
      ConfigModule.forRoot({
        isGlobal: true,
      }),
      HelloModule,
      UserModule,
      AgeModule,
      PostsModule,
    ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
