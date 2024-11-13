import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { CreateTransactionDto } from './dto/transaction.dto';
import { User } from '../users/entities/user.entity';
import { EntityName } from 'src/common/enums/entity.enum';
import { paginationGenerator } from 'src/common/utils/pagination.util';
import { getPreviousMonthDate } from 'src/common/utils/functions';
import { TransactionType } from 'aws-sdk/clients/lakeformation';

@Injectable()
export class TransactionRepository extends Repository<Transaction> {
  constructor(dataSource: DataSource) {
    super(Transaction, dataSource.createEntityManager());
  }

  async createTransaction(productId: number, createTransactionDto: CreateTransactionDto, user: User) {
    const transaction = this.create({
      productId,
      userId: user.id,
      ...createTransactionDto,
    });
    try {
      await this.save(transaction);
    } catch (error) {
      console.log(error.message);
      throw new InternalServerErrorException('Failed to create product');
    }
  }

  async reportProductByType(user: User, type: TransactionType, { limit, page, skip, search }) {
    const oneMonthAgo = getPreviousMonthDate(1);

    const query = this.createQueryBuilder(EntityName.Transaction)
      .select('product.id', 'id')
      .addSelect('product.name', 'name')
      .addSelect('product.image', 'image')
      .addSelect('product.dkp', 'dkp')
      .addSelect('product.stock', 'quantity')
      .addSelect('product.updated_at', 'updated_at')
      .addSelect(
        'CAST(COALESCE(SUM(CASE WHEN transaction.created_at >= :oneMonthAgo THEN transaction.quantity ELSE 0 END), 0) AS INTEGER)',
        'lastMonthQuantity',
      )
      .addSelect('CAST(COALESCE(SUM(transaction.quantity), 0) AS INTEGER)', 'totalQuantity')
      .addSelect('transaction.type', 'transactionType')
      .innerJoin(EntityName.Products, 'product', 'product.id = transaction.productId')
      .leftJoin('product.seller', 'seller')
      .where('transaction.type = :type', { type })
      .andWhere('seller.userId = :userId', { userId: user.id })
      .groupBy('product.id, transaction.type')
      .setParameter('oneMonthAgo', oneMonthAgo);

    if (search) {
      query.andWhere('product.name LIKE :search', { search: `%${search}%` });
    }

    query.orderBy('product.updated_at', 'DESC');

    const countQuery = this.createQueryBuilder(EntityName.Transaction)
      .select('COUNT(DISTINCT product.id)', 'totalCount')
      .innerJoin(EntityName.Products, 'product', 'product.id = transaction.productId')
      .leftJoin('product.seller', 'seller')
      .where('transaction.type = :type', { type })
      .andWhere('seller.userId = :userId', { userId: user.id })
      .setParameter('oneMonthAgo', oneMonthAgo);

    if (search) {
      countQuery.andWhere('product.name LIKE :search', { search: `%${search}%` });
    }

    const countResult = await countQuery.getRawOne();
    const totalCount = parseInt(countResult.totalCount, 10);

    query.offset(skip).limit(limit);

    const products = await query.getRawMany();

    return {
      pagination: paginationGenerator(totalCount, page, limit),
      products,
    };
  }

  async findAllTransaction({ limit, page, skip }) {
    const query = this.createQueryBuilder(EntityName.Transaction)
      .leftJoin('transaction.product', 'product')
      .addSelect(['product.name', 'product.image']);

    const [products, count] = await query
      .orderBy('transaction.created_at', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      pagination: paginationGenerator(count, page, limit),
      products,
    };
  }
}
