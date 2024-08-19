import { Module } from '@nestjs/common';
import { SellerService } from './sellers.service';
import { SellersController } from './sellers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Seller } from './entities/seller.entity';
import { SellersRepository } from './seller.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Seller])],
  controllers: [SellersController],
  providers: [SellerService, SellersRepository],
  exports: [SellerService, SellersRepository],
})
export class SellersModule {}
