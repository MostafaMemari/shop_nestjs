import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Product } from '../entities/product.entity';

import { CreateProductDto, FilterProductDto } from '../dto/product.dto';
import { User } from '../../users/entities/user.entity';
import { EntityName } from 'src/common/enums/entity.enum';
import { paginationGenerator } from 'src/common/utils/pagination.util';
import { getPreviousMonthDate } from 'src/common/utils/functions';

@Injectable()
export class ProductRepository extends Repository<Product> {
  constructor(private readonly dataSource: DataSource) {
    super(Product, dataSource.createEntityManager());
  }
  async createProduct(createProductDto: CreateProductDto, imageDetails: { Location: string; Key: string }) {
    const { sellerId, colorId, categoryId } = createProductDto;

    const product = this.create({
      ...createProductDto,
      seller: { id: sellerId },
      color: { id: colorId },
      category: { id: categoryId },
      image: imageDetails.Location,
      image_key: imageDetails.Key,
    });

    try {
      await this.save(product);
    } catch (error) {
      console.error('Error creating product:', error.message);
      throw new InternalServerErrorException('Failed to create product');
    }
  }

  async findUserProducts(user: User, { limit, page, skip, search, colorId, categoryId, sellerId }) {
    const query = this.createQueryBuilder(EntityName.Products)
      .leftJoin('products.seller', 'seller')
      .leftJoin('products.category', 'category')
      .leftJoin('products.color', 'color')
      .where('seller.userId = :userId', { userId: user.id });

    if (search) query.andWhere('products.name LIKE :search', { search: `%${search}%` });
    if (colorId) query.andWhere('products.colorId = :colorId', { colorId });
    if (categoryId) query.andWhere('products.categoryId = :categoryId', { categoryId });
    if (sellerId) query.andWhere('seller.id = :sellerId', { sellerId });

    const [products, count] = await query
      .orderBy('products.updated_at', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      pagination: paginationGenerator(count, page, limit),
      products,
    };
  }

  async findUserProductsSetting(user: User, { limit, page, skip, search }) {
    const query = this.createQueryBuilder(EntityName.Products)
      .leftJoin('products.seller', 'seller')
      .leftJoinAndSelect('products.product_settings', 'product_settings')
      .where('seller.userId = :userId', { userId: user.id })
      .andWhere('is_robot = :isRobot', { isRobot: true });

    if (search) query.andWhere('products.name LIKE :search', { search: `%${search}%` });

    const [products, count] = await query
      .orderBy('product_settings.is_active', 'DESC')
      .addOrderBy('product_settings.updated_at', 'DESC')
      .addOrderBy('products.updated_at', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      pagination: paginationGenerator(count, page, limit),
      products,
    };
  }

  async findUserProductsReport(
    user: User,
    { limit, page, skip, search, type, colorId, categoryId, sellerId, quantityMin, quantityMax, quantityOrder },
  ) {
    const oneMonthAgo = getPreviousMonthDate(1);

    const query = this.createQueryBuilder(EntityName.Products)
      .leftJoin('products.seller', 'seller')
      .leftJoin('products.transactions', 'transactions')
      .where('seller.userId = :userId', { userId: user.id })
      .orderBy('products.updated_at', 'DESC');

    if (search) query.andWhere('products.name LIKE :search', { search: `%${search}%` });
    if (search) query.andWhere('products.name LIKE :search', { search: `%${search}%` });
    if (colorId) query.andWhere('products.colorId = :colorId', { colorId });
    if (categoryId) query.andWhere('products.categoryId = :categoryId', { categoryId });
    if (sellerId) query.andWhere('seller.id = :sellerId', { sellerId });
    if (quantityMin) query.andWhere('products.quantity >= :quantityMin', { quantityMin });
    if (quantityMax) query.andWhere('products.quantity <= :quantityMax', { quantityMax });
    if (quantityOrder) query.orderBy('products.quantity', quantityOrder === 'asc' ? 'ASC' : 'DESC');

    query
      .addSelect(
        'CAST(COALESCE(SUM(CASE WHEN transactions.type = :type THEN transactions.quantity ELSE 0 END), 0) AS INTEGER)',
        'totalQuantity',
      )
      .addSelect(
        'CAST(COALESCE(SUM(CASE WHEN transactions.type = :type AND transactions.created_at >= :oneMonthAgo THEN transactions.quantity ELSE 0 END), 0) AS INTEGER)',
        'lastMonthQuantity',
      )
      .setParameter('oneMonthAgo', oneMonthAgo)
      .setParameter('type', type)
      .groupBy('products.id')
      .addGroupBy('seller.id');

    const countQuery = query.clone();

    const products = await query.offset(skip).limit(limit).getRawAndEntities();

    const count = await countQuery.getCount();

    return {
      pagination: paginationGenerator(count, page, limit),
      products: products.entities.map((product, index) => ({
        ...product,
        totalQuantity: products.raw[index]?.totalQuantity || 0,
        lastMonthQuantity: products.raw[index]?.lastMonthQuantity || 0,
      })),
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
