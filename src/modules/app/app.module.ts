import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { envValidationSchema } from 'src/common/validation/env.validation';
import { typeOrmConfigAsync } from 'src/config/typeorm.config';
import { APP_PIPE } from '@nestjs/core';
import { CategoriesModule } from '../categories/categories.module';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { ProductsModule } from '../products/products.module';
import { SellersModule } from '../sellers/sellers.module';
import { TransactionsModule } from '../transactions/transactions.module';
import { InvoiceModule } from '../invoice/invoice.module';
import { AwsModule } from '../aws/aws.module';
import { AwsSdkModule } from 'nest-aws-sdk';
import { awsSdkConfigAsync } from 'src/config/aws.config';
import { SaveProductModule } from '../save-product/save-product.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
      validationSchema: envValidationSchema,
    }),
    TypeOrmModule.forRootAsync(typeOrmConfigAsync),
    AwsSdkModule.forRootAsync(awsSdkConfigAsync),
    AwsModule,
    CategoriesModule,
    AuthModule,
    UsersModule,
    ProductsModule,
    SellersModule,
    TransactionsModule,
    InvoiceModule,
    SaveProductModule,
  ],
  controllers: [],
  providers: [{ provide: APP_PIPE, useValue: new ValidationPipe({ whitelist: true }) }],
})
export class AppModule {}
