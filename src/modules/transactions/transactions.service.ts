import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { User } from '../users/entities/user.entity';
import { ProductsService } from '../products/products.service';
import { TransactionRepository } from './transactions.repository';
import { ProductsRepository } from '../products/repository/products.repository';

import { adjustProductQuantity } from 'src/common/utils/product.utils';
import { TransactionsMessage } from 'src/common/enums/messages.enum';

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

  findAll() {
    return `This action returns all transactions`;
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
