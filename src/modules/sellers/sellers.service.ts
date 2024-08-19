import { Injectable } from '@nestjs/common';
import { CreateSellerDto } from './dto/create-seller.dto';
import { UpdateSellerDto } from './dto/update-seller.dto';
import { SellersRepository } from './seller.repository';

@Injectable()
export class SellersService {
  constructor(private sellersRepository: SellersRepository) {}
  create(createSellerDto: CreateSellerDto) {
    return this.sellersRepository.createSeller(createSellerDto);
  }

  findAll() {
    return `This action returns all sellers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} seller`;
  }

  update(id: number, updateSellerDto: UpdateSellerDto) {
    return `This action updates a #${id} seller`;
  }

  remove(id: number) {
    return `This action removes a #${id} seller`;
  }
}
