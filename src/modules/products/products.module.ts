import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { ProductsRepository } from './products.repository';
import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ProductsController } from './products.controller';
import { Product } from './entities/product.entity';
import { ColorsRepository } from '../colors/colors.repository';
import { CategoriesRepository } from '../categories/categories.repository';
import { SellersRepository } from '../sellers/seller.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), AuthModule],
  controllers: [ProductsController],
  providers: [ProductsService, ProductsRepository, ColorsRepository, CategoriesRepository, SellersRepository],
})
export class ProductsModule {}
