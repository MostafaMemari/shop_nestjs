import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
import { TransactionsModule } from '../transactions/transactions.module';
import { InvoiceModule } from '../invoice/invoice.module';
import { AwsModule } from '../aws/aws.module';
import { AwsSdkModule } from 'nest-aws-sdk';
import { awsSdkConfig } from 'src/config/aws.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
      validationSchema: envValidationSchema,
    }),
    TypeOrmModule.forRootAsync(typeOrmConfigAsync),
    AwsSdkModule.forRoot(awsSdkConfig()),

    ColorsModule,
    CategoriesModule,
    AuthModule,
    UsersModule,
    ProductsModule,
    SellersModule,
    TransactionsModule,
    InvoiceModule,
    AwsModule,
  ],
  controllers: [],
  providers: [{ provide: APP_PIPE, useValue: new ValidationPipe({ whitelist: true }) }],
})
export class AppModule {}
