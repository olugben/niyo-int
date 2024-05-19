import { IsPositive, IsNotEmpty, IsNumber, MinLength, MaxLength, IsString } from "class-validator";

class SignUpDto{

  name:string;
  email: string;
  
  @IsNotEmpty()

  @MinLength(6)
  @MaxLength(6)
  password: string;  
}
export default SignUpDto