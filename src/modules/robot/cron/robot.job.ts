import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { RobotService } from '../robot.service';

@Injectable()
export class RobotJob {
  constructor(private readonly robotService: RobotService) {}

  // @Cron('*/10 * * * * *') // اجرای هر ساعت
  // async handleCron() {
  //   console.log('Running robot job...');
  //   // await this.robotService.fetchAndProcessData();
  // }
}
