import { Body, Controller, Post, UseGuards} from "@nestjs/common";
import LoginDto from "src/dto/login.dto";
import SignUpDto from "src/dto/signup.dto";
import { AuthService } from "./auth.service";
import { AuthGuard } from "@nestjs/passport";



@Controller("auth")
export class AuthController{
    constructor(private authservice: AuthService){}
    
    
    @Post('/signup')
    signup(@Body() signUpDto: SignUpDto):Promise<{token :string}>{
        
    return this.authservice.signUp(signUpDto)
    }

    @Post('signin') 
    login(@Body() loginDto: LoginDto):Promise<{token:string}>{
        return this.authservice.login(loginDto);
    }
}