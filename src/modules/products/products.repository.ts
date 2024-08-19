import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { Color } from '../colors/entities/color.entity';
import { Category } from '../categories/entities/categories.entity';
import { Seller } from '../sellers/entities/seller.entity';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsRepository extends Repository<Product> {
  constructor(dataSource: DataSource) {
    super(Product, dataSource.createEntityManager());
  }

  async createProduct(createProductDto: CreateProductDto, color: Color, category: Category, seller: Seller) {
    const product = this.create({ ...createProductDto, color, category, seller });
    try {
      await this.save(product);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
