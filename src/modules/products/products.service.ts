import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ColorsRepository } from '../colors/colors.repository';
import { CategoriesRepository } from '../categories/categories.repository';
import { SellersRepository } from '../sellers/seller.repository';
import { ProductsRepository } from './products.repository';
import { ProductsMessage } from 'src/common/enums/messages.enum';

@Injectable()
export class ProductsService {
  constructor(private readonly productRepository: ProductsRepository) {}

  async create(createProductDto: CreateProductDto) {
    await this.productRepository.createProduct(createProductDto);

    return {
      message: ProductsMessage.CreatedProductSuccess,
    };
  }

  findAll() {
    return `This action returns all products`;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
