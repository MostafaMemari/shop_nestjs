import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ProductsController } from './products.controller';
import { Product } from './entities/product.entity';
import { SellersModule } from '../sellers/sellers.module';
import { ColorsModule } from '../colors/colors.module';
import { CategoriesModule } from '../categories/categories.module';
import { ProductsRepository } from './products.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), AuthModule, SellersModule, ColorsModule, CategoriesModule],
  controllers: [ProductsController],
  providers: [ProductsService, ProductsRepository],
})
export class ProductsModule {}
