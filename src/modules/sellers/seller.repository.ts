import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Seller } from './entities/seller.entity';
import { CreateSellerDto } from './dto/create-seller.dto';

@Injectable()
export class SellersRepository extends Repository<Seller> {
  constructor(dataSource: DataSource) {
    super(Seller, dataSource.createEntityManager());
  }

  createSeller(createSellerDto: CreateSellerDto) {
    return createSellerDto;
  }
}
