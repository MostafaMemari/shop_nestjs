import { Module } from '@nestjs/common';
import { SaveProductService } from './save-product.service';
import { SaveProductController } from './save-product.controller';
import { ProductsService } from '../products/products.service';
import { ProductsModule } from '../products/products.module';
import { AwsService } from '../aws/aws.service';
import { AwsModule } from '../aws/aws.module';
import { ColorsRepository } from '../colors/colors.repository';

@Module({
  imports: [ProductsModule, AwsModule],
  controllers: [SaveProductController],
  providers: [SaveProductService, ColorsRepository],
})
export class SaveProductModule {}
