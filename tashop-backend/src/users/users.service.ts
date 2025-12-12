import { Injectable, UnprocessableEntityException } from "@nestjs/common";
import { CreateUserRequest } from "./dto/create-user.request";
import { PrismaService } from "src/prisma/prisma.service";
 
import * as bcrypt from 'bcrypt'
import { Prisma, User } from "@prisma/client";
@Injectable()
export class UsersService
{
    constructor (private readonly prismaService:PrismaService){

    }
   async createUser(data:CreateUserRequest) : Promise<User>
    {

        try{
               return  await this.prismaService.user.create({
            data:{
                ...data,
                password:await bcrypt.hash(data.password,10)
            }

        });
        }
        catch (err){
                 
                if(err.code==='P2002')
                {
                    throw new UnprocessableEntityException("Email exists")

                }
                throw err;
        }
   
    }

    async getUser(filter:Prisma.UserWhereUniqueInput)
    {
        return this.prismaService.user.findUniqueOrThrow({
            where:filter
        });
        //filter kısmı email şifre vb değerler alabilir , orm bu değeri db de arar 
    }
}   