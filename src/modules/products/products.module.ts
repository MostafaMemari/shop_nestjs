import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { Product } from './entities/product.entity';
import { SellersModule } from '../sellers/sellers.module';
import { ColorsModule } from '../colors/colors.module';
import { CategoriesModule } from '../categories/categories.module';
import { ProductSettings } from './entities/settings-product.entity';
import { ProductSettingsRepository } from './repository/product-settings.repository';
import { ProductsController } from './products.controller';
import { AwsService } from '../aws/aws.service';
import { ProductRepository } from './repository/products.repository';
import { RelatedProduct } from './entities/related-product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, ProductSettings, RelatedProduct]),
    AuthModule,
    SellersModule,
    ColorsModule,
    CategoriesModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService, ProductRepository, ProductSettingsRepository, AwsService],
  exports: [ProductsService, ProductRepository],
})
export class ProductsModule {}
