import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductRequest } from './dto/create-product.request';
import { PrismaService } from 'src/prisma/prisma.service';
import { promises as fs } from "fs";
import { join } from "path";
import { PRODUCT_IMAGES } from './product-image';
@Injectable()
export class ProductsService {
    constructor(private readonly prismaService:PrismaService){}

    async createProduct(data:CreateProductRequest , userId:number)
    {
            return this.prismaService.product.create({
                data:{
                    ...data,
                    userId,
                    
                }
            })
    }

    async getProducts()
    {
        const products=await this.prismaService.product.findMany();
        return Promise.all(products.map(async (product)=>({...product,imageExist:await this.imageExist(product.id)})),
    );       
    }

private async imageExist(productId: number) {
  try {
    await fs.access(
      join(process.cwd(),`public/images/products/${productId}.png`),
      fs.constants.F_OK,
    );
    return true;
  } catch (err) {
    return false;
  }
}

async getProduct(productId:number){
    try {
           return {...(await this.prismaService.product.findUniqueOrThrow(
        {where:{id:productId}})),
        imageExist:await this.imageExist(productId),
    
    };
    } catch (error) {
            throw new NotFoundException("Product not found with ID")
    }
 
}
}
