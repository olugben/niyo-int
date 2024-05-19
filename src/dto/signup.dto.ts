import { IsPositive, IsNotEmpty, IsNumber, MinLength, MaxLength, IsString, IsEmail } from "class-validator";

class SignUpDto{
@IsString()
  name:string;
  @IsEmail()
  email: string;
  
  @IsNotEmpty()

  @MinLength(6)
  
  password: string;  
}
export default SignUpDto