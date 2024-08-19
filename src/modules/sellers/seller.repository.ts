import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Seller } from './entities/seller.entity';
import { CreateSellerDto } from './dto/create-seller.dto';
import { User } from '../users/entities/user.entity';
import { SellersMessage } from 'src/common/enums/messages.enum';

@Injectable()
export class SellersRepository extends Repository<Seller> {
  constructor(dataSource: DataSource) {
    super(Seller, dataSource.createEntityManager());
  }

  async createSeller(createSellerDto: CreateSellerDto, user: User) {
    const seller = this.create({ ...createSellerDto, user });

    try {
      await this.save(seller);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async findById(id: number) {
    const seller = await this.findOneBy({ id });
    if (!seller) throw new NotFoundException(SellersMessage.NotFoundSeller);
    return seller;
  }
}
