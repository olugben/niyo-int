import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import User from "src/entities/user.entity";
import { AuthService } from "./auth.service";
import { JwtModule, JwtService } from "@nestjs/jwt";

import { AuthController } from "./auth.controller";
import { JwtStrategy } from "src/strategy/jwt.strategy";
import Todo from "src/entities/todo.entity";


@Module({
    imports:[
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Todo]),   
   PassportModule.register({defaultStrategy:'jwt'}),
   JwtModule.registerAsync({
    imports:[ConfigModule],
    inject:[ConfigService],

    useFactory:(config:ConfigService)=>{
        return {
            secret:config.get<string>('JWT_SECRET'),
            signOptions:{
                expiresIn:config.get<string |number>('JWT_EXPIRES'),
            }
        }
    }
   })
    ],
    controllers:[AuthController],
    providers: [AuthService, JwtStrategy],
    exports:[JwtStrategy, PassportModule, AuthService]

})
export class AuthModule{}