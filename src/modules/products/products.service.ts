import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsRepository } from './products.repository';
import { ProductsMessage } from 'src/common/enums/messages.enum';
import { User } from '../users/entities/user.entity';
import { EntityName } from 'src/common/enums/entity.enum';

@Injectable()
export class ProductsService {
  constructor(private readonly productRepository: ProductsRepository) {}

  async create(createProductDto: CreateProductDto) {
    await this.productRepository.createProduct(createProductDto);

    return {
      message: ProductsMessage.CreatedProductSuccess,
    };
  }

  async findAll(user: User) {
    return await this.productRepository.findUserProducts(user);
  }

  async findOneById(id: number, user: User) {
    const product = await this.productRepository.findUserProductById(id, user);
    if (!product) throw new NotFoundException(ProductsMessage.NotFoundProduct);
    return product;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  async remove(id: number, user: User) {
    const product = await this.findOneById(id, user);
    await this.productRepository.remove(product);

    return {
      message: ProductsMessage.RemoveProductSuccess,
    };
  }
}
