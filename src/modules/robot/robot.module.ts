import { forwardRef, Module } from '@nestjs/common';
import { CustomHttpModule } from '../http/http.module';
import { RobotService } from './robot.service';
import { RobotJob } from './cron/robot.job';
import { SellersModule } from '../sellers/sellers.module';
import { SchedulerRegistry } from '@nestjs/schedule';
import { SellerService } from '../sellers/sellers.service';
import { SellersRepository } from '../sellers/seller.repository';

@Module({
  imports: [CustomHttpModule, forwardRef(() => SellersModule)],
  providers: [RobotService, RobotJob, SchedulerRegistry],
  exports: [RobotService, RobotJob, SchedulerRegistry],
})
export class RobotModule {}
