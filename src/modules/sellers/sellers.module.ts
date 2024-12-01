import { forwardRef, Module } from '@nestjs/common';
import { SellerService } from './sellers.service';
import { SellersController } from './sellers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Seller } from './entities/seller.entity';
import { SellersRepository } from './seller.repository';
import { RobotModule } from '../robot/robot.module';
import { SchedulerRegistry } from '@nestjs/schedule';

@Module({
  imports: [TypeOrmModule.forFeature([Seller]), forwardRef(() => RobotModule)],
  providers: [SellerService, SellersRepository],
  controllers: [SellersController],
  exports: [SellerService, SellersRepository],
})
export class SellersModule {}
