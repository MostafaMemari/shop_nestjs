import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { envValidationSchema } from 'src/common/validation/env.validation';
import { typeOrmConfigAsync } from 'src/config/typeorm.config';
import { ColorsModule } from '../colors/colors.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
      validationSchema: envValidationSchema,
    }),
    TypeOrmModule.forRootAsync(typeOrmConfigAsync),
    ColorsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
