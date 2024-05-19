
import { IsNotEmpty, IsBoolean, IsEmail, IsPositive, IsNumber, MaxLength, MinLength } from 'class-validator';
class LoginDto{
  @IsEmail()
    email: string;
   
    @IsNotEmpty()
    @MinLength(6)
    
    password: string;  
  }
  export default LoginDto