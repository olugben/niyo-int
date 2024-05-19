import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import LoginDto from "src/dto/login.dto";
import SignUpDto from "src/dto/signup.dto";
import User from "src/entities/user.entity";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";


@Injectable()
export class AuthService{
    constructor(@InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
){}


async signUp(signUpDto: SignUpDto):Promise<{token :string}>{

    const {name, email, password}=signUpDto;
    const hashedPassword =await bcrypt.hash(password, 10);
    const user =await this.usersRepository.create({
        name,
        email,
        password: hashedPassword,
    });
    await this.usersRepository.save(user);
    const token =this.jwtService.sign(
        {id: user.id}
    )

return {token};



}

async login(loginDto: LoginDto):Promise<{token:string}>{
    const {email, password}=loginDto;
    const user =await this.usersRepository.findOne({
        where:{email},
    });
    if(!user){
        throw new UnauthorizedException("Invalid email or password");
    }
    const isPasswordMatched =await bcrypt.compare(password, user.password);
    if(!isPasswordMatched){throw new UnauthorizedException("Invalid email or Password");}
    const token =this.jwtService.sign({id:user.id});
    return {token}
}

}