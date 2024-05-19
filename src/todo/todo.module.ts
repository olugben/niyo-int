import { Module } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Todo from 'src/entities/todo.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';


import { JwtStrategy } from 'src/strategy/jwt.strategy';

import { TodoGateway } from './todo.gateway';

@Module({
  imports:[ TypeOrmModule.forFeature([Todo]),
  
  
 ],
 exports:[ TodoService],
  providers: [TodoService, JwtService],
  controllers: [TodoController]
})
export class TodoModule {}
