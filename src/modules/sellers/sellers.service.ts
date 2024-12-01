import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSellerDto, UpdateSellerDto } from './dto/create-seller.dto';
import { SellersRepository } from './seller.repository';
import { User } from '../users/entities/user.entity';
import { SellersMessage } from 'src/common/enums/messages.enum';
import { Seller } from './entities/seller.entity';
import { RobotJob } from '../robot/cron/robot.job';

@Injectable()
export class SellerService {
  constructor(
    private sellersRepository: SellersRepository,
    private robotJob: RobotJob,
  ) {}
  async create(createSellerDto: CreateSellerDto, user: User) {
    const seller = await this.sellersRepository.createSeller(createSellerDto, user);

    if (createSellerDto.robot_start_time !== undefined || createSellerDto.is_robot !== undefined) {
      await this.robotJob.resetCronJobs();
      console.log(`Cron job for seller ${seller.id} has been set.`);
    }

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

    // if (seller.user.id !== user.id) {
    //   throw new ForbiddenException('شما اجازه به‌روزرسانی این فروشنده را ندارید');
    // }

    await this.sellersRepository.update(id, updateSellerDto);

    if (updateSellerDto.robot_start_time !== undefined || updateSellerDto.is_robot !== undefined) {
      await this.robotJob.resetCronJobs();
    }

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

  async getSellersWithRobots() {
    return this.sellersRepository.find({
      where: { is_robot: true },
    });
  }

  async getSellerById(sellerId: number): Promise<Seller> {
    return this.sellersRepository.findOne({
      where: { seller_id: sellerId },
    });
  }
}
