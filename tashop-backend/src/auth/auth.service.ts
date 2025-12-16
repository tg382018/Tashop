import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from "bcrypt"
import { ConfigService } from '@nestjs/config';
 import {Response} from 'express';
import { TokenPayload } from './token-payload.interfaces';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import ms from 'ms';
@Injectable()
export class AuthService {

    constructor (private readonly userService:UsersService,
        private readonly configService:ConfigService,
    private readonly jwtService:JwtService){}

    async login(user:User,response:Response ){
        const expires =new Date();
        expires.setMilliseconds(
      expires.getMilliseconds() +
        ms(this.configService.getOrThrow<string>('JWT_EXPIRATION') as ms.StringValue)
        );

        const tokenPayload :TokenPayload={userId:user.id};
        const token=this.jwtService.sign(tokenPayload);
        response.cookie('Authentication',token,{
            secure:true,
            httpOnly:true,
            expires
        });
        return {tokenPayload}
    }

    async verifyUser(email:string,password:string)
    {
            try {
                const user=await this.userService.getUser({email}) 
                //emaili getusera gönderiyoruz orada bu maile ait kullanıcı varsa user a kaydediyoruz bilgilerini
                const isPasswordValid = await bcrypt.compare(password,user.password)
                  //o userin passwordunu girilen passwordla karşılaştırıyoruz 
                  if(!isPasswordValid)
                  {
                    throw new UnauthorizedException("Wrong credentials")
                  }
                  return user;
            } 
            catch (error) {
                    throw new UnauthorizedException("Wrong credentials")
            }
    }
}
