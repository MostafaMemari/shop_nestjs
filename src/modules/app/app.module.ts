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
import { CustomHttpModule } from '../http/http.module';
import { ScheduleModule } from '@nestjs/schedule';
import { RobotModule } from '../robot/robot.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env',
      validationSchema: envValidationSchema,
    }),
    TypeOrmModule.forRootAsync(typeOrmConfigAsync),
    AwsSdkModule.forRootAsync(awsSdkConfigAsync),
    ScheduleModule.forRoot(),
    AwsModule,
    CategoriesModule,
    AuthModule,
    UsersModule,
    ProductsModule,
    SellersModule,
    TransactionsModule,
    InvoiceModule,
    SaveProductModule,
    CustomHttpModule,
    RobotModule,
  ],
  controllers: [],
  providers: [{ provide: APP_PIPE, useValue: new ValidationPipe({ whitelist: true }) }],
})
export class AppModule {}
