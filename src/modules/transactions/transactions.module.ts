import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { ProductsModule } from '../products/products.module';
import { TransactionRepository } from './transactions.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction]), ProductsModule],
  controllers: [TransactionsController],
  providers: [TransactionsService, TransactionRepository],
})
export class TransactionsModule {}
