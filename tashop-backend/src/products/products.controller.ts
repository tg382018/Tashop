import { Body, Controller, FileTypeValidator, Get, MaxFileSizeValidator, Param, ParseFilePipe, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateProductRequest } from './dto/create-product.request';
import { CurrentUser } from 'src/auth/current-user.decorator';
import type { TokenPayload } from '../auth/token-payload.interfaces';
import { ProductsService } from './products.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { PRODUCT_IMAGES } from './product-image';

@Controller('products')
export class ProductsController {
    constructor(private readonly productService:ProductsService){}

    @Post()
    @UseGuards(JwtAuthGuard)
    async createProduct(
        @Body() body:CreateProductRequest,
        @CurrentUser() user:TokenPayload,

    ){
        return this.productService.createProduct(body,user.userId)
    }

    @Post(':productId/image')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(
        FileInterceptor('image',{
            storage:diskStorage({
                destination:PRODUCT_IMAGES,
                filename:(req,file,callback)=>{
                    callback(null,`${req.params.productId}.png`)
                }
            })
        })
    )

    uploadProductImage(
        @UploadedFile()
        _file:Express.Multer.File
    ){
        return { success: true };
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    async getProducts(){
        return this.productService.getProducts()
    }

    @Get(':productId')
    @UseGuards(JwtAuthGuard)
    async getProduct(@Param('productId') productId:string){
        return this.productService.getProduct(+productId)
    }
}
