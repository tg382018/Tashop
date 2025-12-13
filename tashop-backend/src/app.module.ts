import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino/LoggerModule';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { CheckoutModule } from './checkout/checkout.module';
 
@Module({
  // BİR SERVİCE NIN BAŞINDA INJECTABLE VARSA ONU NORMALDE KENDI MODULESUNDA EXPORT VE PROVIDE  ETMEK GEREKİRDAHA SONRA BAŞKA BİR YERDE CONSTTRUCTOR İLE KULLANILABİLİR
  imports: [
    LoggerModule.forRootAsync({
      imports:[ConfigModule],
      useFactory:(configService:ConfigService)=>{
        const isProduction=configService.get('NODE_ENV')==='production'
        return{
          pinoHttp:{
            transport:isProduction? undefined:{
              target:'pino-pretty',
              options:{
                singleLine:true,
              }
            },
            level:isProduction?'info':'debug',

          }
        };
      },
      inject:[ConfigService],
    }),
ServeStaticModule.forRoot({
  rootPath: join(process.cwd(), 'public'),
  serveRoot: '/',
  exclude: ['/api*', '/auth*', '/users*'],
}),




    ConfigModule.forRoot(),UsersModule, PrismaModule, AuthModule, ProductsModule, CheckoutModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
