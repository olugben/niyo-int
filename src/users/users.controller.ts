import { Body, Controller, Delete, Get, Param, Post, UseGuards } from "@nestjs/common";
import CreateUserDto from "src/dto/user.dto";
import User from "src/entities/user.entity";
import { UsersService } from "./users.service";
import { AuthGuard } from "@nestjs/passport";



@Controller("users")
export class UsersController{
    constructor(private readonly usersService: UsersService){}
    @Get()
    @UseGuards(AuthGuard('jwt'))
    async getAllUsers(): Promise<User[]>{
        const users=await this.usersService.getAllUsers();
        return users;
    }
    

    @Get(':id')
    async getUserById(@Param('id') id:string): Promise<User>{
        const user=await this.usersService.getUserById(Number(id));
        return user;
    }

    @Post()
    async createUser(@Body() createUserDto: CreateUserDto){
        const newUser =await this.usersService.createUser(createUserDto);
        return newUser;
    }
    @Delete(':id')
    async deleteById(@Param('id') id :string):Promise<User>{
     const user =this.usersService.deleteById(Number(id));
        return user;
    }
}