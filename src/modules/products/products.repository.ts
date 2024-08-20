import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Product } from './entities/product.entity';

import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsRepository extends Repository<Product> {
  constructor(dataSource: DataSource) {
    super(Product, dataSource.createEntityManager());
  }

  async createProduct(createProductDto: CreateProductDto) {
    const { name, price, quantity, sellerId, colorId, categoryId } = createProductDto;

    const product = this.create({
      name,
      price,
      quantity,
      seller: { id: sellerId },
      color: { id: colorId },
      category: { id: categoryId },
    });
    try {
      await this.save(product);
    } catch (error) {
      console.log(error.message);
      throw new InternalServerErrorException('Failed to create product');
    }
  }
}
