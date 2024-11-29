import { Module } from '@nestjs/common';
import { CustomHttpModule } from '../http/http.module';
import { RobotService } from './robot.service';
import { RobotController } from './robot.controller';
import { RobotJob } from './cron/robot.job';

@Module({
  imports: [CustomHttpModule],
  providers: [RobotService, RobotJob],
  controllers: [RobotController],
  exports: [RobotService],
})
export class RobotModule {}
