import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class TransactionRepository extends Repository<Transaction> {
  constructor(dataSource: DataSource) {
    super(Transaction, dataSource.createEntityManager());
  }

  async createTransaction(productId: number, createTransactionDto: CreateTransactionDto) {
    const transaction = this.create({
      product: { id: productId },
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
