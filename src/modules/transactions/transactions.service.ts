import { Injectable, Search } from '@nestjs/common';
import { CreateTransactionDto, TransactionTypeDto, UpdateTransactionDto } from './dto/transaction.dto';
import { User } from '../users/entities/user.entity';
import { ProductsService } from '../products/products.service';
import { TransactionRepository } from './transactions.repository';
import { ProductRepository } from '../products/repository/products.repository';
import { adjustProductQuantity } from 'src/common/utils/product.utils';
import { TransactionsMessage } from 'src/common/enums/messages.enum';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { paginationSolver } from 'src/common/utils/pagination.util';
import { TransactionType } from 'aws-sdk/clients/lakeformation';
import { getPreviousMonthDate } from 'src/common/utils/functions';
import { FilterProductDto } from '../products/dto/product.dto';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly productService: ProductsService,
    private readonly transactionRepository: TransactionRepository,
    private readonly productRepository: ProductRepository,
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

  async generateReportByType(
    user: User,
    type: TransactionType,
    paginationDto: PaginationDto,
    filterDto: FilterProductDto,
  ) {
    const { limit, page, skip } = paginationSolver(paginationDto);
    const { search } = filterDto;
    return this.transactionRepository.reportProductByType(user, type, { limit, page, skip, search });
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit, page, skip } = paginationSolver(paginationDto);

    return this.transactionRepository.findAllTransaction({ limit, page, skip });
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
