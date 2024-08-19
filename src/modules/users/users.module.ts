import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { UsersRepository } from './users.repository';
import { Product } from '../products/entities/product.entity';
import { Transaction } from '../transactions/entities/transaction.entity';
import { Seller } from '../sellers/entities/seller.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Product, Transaction, Seller])],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService],
})
export class UsersModule {}
