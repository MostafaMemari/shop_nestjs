import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Product } from '../products/entities/product.entity';
import { User } from '../users/entities/user.entity';

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
}
