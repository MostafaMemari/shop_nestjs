import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Product } from '../entities/product.entity';

import { CreateProductDto, FilterProductDto } from '../dto/product.dto';
import { User } from '../../users/entities/user.entity';
import { EntityName } from 'src/common/enums/entity.enum';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { paginationGenerator, paginationSolver } from 'src/common/utils/pagination.util';

@Injectable()
export class ProductsRepository extends Repository<Product> {
  constructor(dataSource: DataSource) {
    super(Product, dataSource.createEntityManager());
  }

  async createProduct(createProductDto: CreateProductDto) {
    const { sellerId, colorId, categoryId } = createProductDto;

    const product = this.create({
      ...createProductDto,
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
  async findUserProducts(user: User, paginationDto: PaginationDto, filterDto: FilterProductDto) {
    const { limit, page, skip } = paginationSolver(paginationDto);
    let { search } = filterDto;

    const query = this.createQueryBuilder(EntityName.Products)
      .leftJoinAndSelect('products.seller', 'seller')
      .where('seller.userId = :userId', { userId: user.id });

    if (search) query.andWhere('products.name LIKE :search', { search: `%${search}%` });

    const [products, count] = await query.skip(skip).take(limit).getManyAndCount();

    return {
      pagination: paginationGenerator(count, page, limit),
      products,
    };
  }

  async findUserProductById(id: number, user: User) {
    return await this.createQueryBuilder(EntityName.Products)
      .where('products.id = :id', { id })
      .leftJoin('products.seller', 'seller')
      .andWhere('seller.userId = :userId', { userId: user.id })
      .getOne();
  }
  async findOneByIdAndRelationSetting(id: number, user: User) {
    return await this.createQueryBuilder(EntityName.Products)
      .where('products.id = :id', { id })
      .leftJoinAndSelect('products.seller', 'seller')
      .leftJoinAndSelect('products.product_settings', 'product_settings')
      .andWhere('seller.userId = :userId', { userId: user.id })
      .getOne();
  }
}
