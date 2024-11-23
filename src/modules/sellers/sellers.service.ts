import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
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

  async findAll(user: User) {
    const seller = await this.sellersRepository.findBy({ user });
    if (!seller) throw new NotFoundException(SellersMessage.NotFoundSeller);
    return seller;
  }

  async findOneById(id: number, user: User) {
    const seller = await this.sellersRepository.findOneBy({ id, user });
    if (!seller) throw new NotFoundException(SellersMessage.NotFoundSeller);
    return seller;
  }

  async update(id: number, updateSellerDto: UpdateSellerDto, user: User) {
    const seller = await this.sellersRepository.findOne({ where: { id } });
    if (!seller) {
      throw new NotFoundException(`فروشنده با شناسه ${id} یافت نشد`);
    }

    // if (seller.user !== user) {
    //   throw new ForbiddenException('شما اجازه به‌روزرسانی این فروشنده را ندارید');
    // }

    await this.sellersRepository.update(id, updateSellerDto);

    return {
      message: SellersMessage.UpdatedSellerSuccess,
    };
  }

  async remove(id: number, user: User) {
    const color = await this.findOneById(id, user);
    await this.sellersRepository.remove(color);

    return {
      message: SellersMessage.RemoveSellerSuccess,
    };
  }
}
