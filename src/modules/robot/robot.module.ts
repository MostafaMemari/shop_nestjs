import { forwardRef, Module } from '@nestjs/common';
import { CustomHttpModule } from '../http/http.module';
import { RobotService } from './robot.service';
import { RobotJob } from './cron/robot.job';
import { SellersModule } from '../sellers/sellers.module';
import { SchedulerRegistry } from '@nestjs/schedule';
import { RobotController } from './robot.controller';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [CustomHttpModule, forwardRef(() => ProductsModule), forwardRef(() => SellersModule)],
  providers: [RobotService, RobotJob, SchedulerRegistry],
  controllers: [RobotController],
  exports: [RobotService, RobotJob, SchedulerRegistry],
})
export class RobotModule {}
