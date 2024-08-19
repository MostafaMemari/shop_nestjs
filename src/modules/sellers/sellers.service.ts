import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSellerDto } from './dto/create-seller.dto';
import { UpdateSellerDto } from './dto/update-seller.dto';
import { SellersRepository } from './seller.repository';
import { User } from '../users/entities/user.entity';
import { SellersMessage } from 'src/common/enums/messages.enum';

@Injectable()
export class SellerService {
  constructor(private sellersRepository: SellersRepository) {}
  async create(createSellerDto: CreateSellerDto, user: User) {
    await this.sellersRepository.createSeller(createSellerDto, user);

    return {
      message: SellersMessage.CreatedSellerSuccess,
    };
  }

  findAll() {
    return `This action returns all sellers`;
  }

  findOneById(id: number) {
    const seller = this.sellersRepository.findOneBy({ id });
    if (!seller) throw new NotFoundException();
    return seller;
  }

  update(id: number, updateSellerDto: UpdateSellerDto) {
    return `This action updates a #${id} seller`;
  }

  remove(id: number) {
    return `This action removes a #${id} seller`;
  }
}
