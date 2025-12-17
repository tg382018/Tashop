import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductRequest } from './dto/create-product.request';
import { PrismaService } from 'src/prisma/prisma.service';
import { promises as fs } from "fs";
import { join } from "path";
import { Prisma } from '@prisma/client';
import { ProductsGateway } from './products-gateway';
@Injectable()
export class ProductsService {
    constructor(private readonly prismaService:PrismaService,private readonly productsGateway:ProductsGateway){}

    async createProduct(data:CreateProductRequest , userId:number)
    {
            const product=await this.prismaService.product.create({
                data:{
                    ...data,
                    userId,
                    
                }
            });
            this.productsGateway.handleProductUpdated();// SOCKETİ TETİKLEYİP TEKRAR GET PRODUCTS YAPTIRIYOR
            return product;
    }

    async getProducts(status?:string)
    {
        const args:Prisma.ProductFindManyArgs={};
        if(status=='availible'){
          args.where={sold:false};
        }
        const products=await this.prismaService.product.findMany(args);
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


async update(productId:number,data:Prisma.ProductUpdateInput){
  await this.prismaService.product.update({
    where:{id:productId},
    data,
  });
  this.productsGateway.handleProductUpdated(); // SOCKETİ TETİKLEYİP TEKRAR GET PRODUCTS YAPTIRIYOR
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
