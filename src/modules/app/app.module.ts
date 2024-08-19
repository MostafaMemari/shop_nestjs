import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { envValidationSchema } from 'src/common/validation/env.validation';
import { typeOrmConfigAsync } from 'src/config/typeorm.config';
import { ColorsModule } from '../colors/colors.module';
import { APP_PIPE } from '@nestjs/core';
import { CategoriesModule } from '../categories/categories.module';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { ProductsModule } from '../products/products.module';
import { SellersModule } from '../sellers/sellers.module';
import { StoresModule } from '../stores/stores.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
      validationSchema: envValidationSchema,
    }),
    TypeOrmModule.forRootAsync(typeOrmConfigAsync),
    ColorsModule,
    CategoriesModule,
    AuthModule,
    UsersModule,
    ProductsModule,
    SellersModule,
    StoresModule,
  ],
  controllers: [],
  providers: [{ provide: APP_PIPE, useValue: new ValidationPipe({ whitelist: true }) }],
})
export class AppModule {}
