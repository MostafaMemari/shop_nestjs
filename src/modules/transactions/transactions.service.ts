import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { User } from '../users/entities/user.entity';
import { ProductsService } from '../products/products.service';
import { TransactionRepository } from './transactions.repository';
import { ProductsRepository } from '../products/repository/products.repository';
import { adjustProductQuantity } from 'src/common/utils/product.utils';
import { TransactionsMessage } from 'src/common/enums/messages.enum';
import { EntityName } from 'src/common/enums/entity.enum';
import { paginationGenerator, paginationSolver } from 'src/common/utils/pagination.util';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly productService: ProductsService,
    private readonly transactionRepository: TransactionRepository,
    private readonly productRepository: ProductsRepository,
  ) {}
  async create(productId: number, createTransactionDto: CreateTransactionDto, user: User) {
    const { type, quantity } = createTransactionDto;

    const product = await this.productService.findOneById(productId, user);
    adjustProductQuantity(product, quantity, type);
    await this.transactionRepository.createTransaction(productId, createTransactionDto, user);
    await this.productRepository.update(productId, { quantity: product.quantity });

    return {
      message: TransactionsMessage.CreatedTransactionSuccess,
    };
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit, page, skip } = paginationSolver(paginationDto);

    const query = this.transactionRepository
      .createQueryBuilder(EntityName.Transaction)
      .leftJoin('transaction.product', 'product')
      .addSelect(['product.name', 'product.image']);

    const [products, count] = await query
      .orderBy('transaction.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      pagination: paginationGenerator(count, page, limit),
      products,
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} transaction`;
  }

  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    return `This action updates a #${id} transaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }
}
