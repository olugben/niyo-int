import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import Joi from '@hapi/joi';
import { DatabaseModule } from './database.module';
import { UsersModule } from './users/user.module';
import { AuthModule } from './auth/auth.module';

import { TodoModule } from './todo/todo.module';
import { TodoGateway } from './todo/todo.gateway';
import { JwtModule } from '@nestjs/jwt';


@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath:'.development.env',
       validationSchema: Joi.object({
      POSTGRES_HOST:Joi.string().required(),
      POSTGRES_PORT:Joi.string().required(),
      POSTGRES_USER:Joi.string().required(),
      POSTGRES_PASSWORD:Joi.string().required(),
      POSTGRES_DB:Joi.string().required(),
      PORT:Joi.number()
    })}),
    DatabaseModule,
    UsersModule,
    AuthModule,
    TodoModule,
  JwtModule
    
  ],
  controllers: [AppController],
  providers: [AppService, TodoGateway],
})
export class AppModule {}
