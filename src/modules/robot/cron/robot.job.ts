import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { Seller } from 'src/modules/sellers/entities/seller.entity';
import { SellerService } from 'src/modules/sellers/sellers.service';
import { RobotService } from '../robot.service';

@Injectable()
export class RobotJob {
  constructor(
    @Inject(forwardRef(() => SellerService)) private readonly sellerService: SellerService,
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly robotService: RobotService,
  ) {
    this.initializeCronJobs();
  }

  private async initializeCronJobs() {
    const sellers = await this.sellerService.getSellersWithRobots();

    for (const seller of sellers) {
      this.addCronJobForSeller(seller);
    }
  }

  private addCronJobForSeller(seller: Seller) {
    const jobName = `robotJob-${seller.id}`;
    const intervalInSeconds = seller.robot_start_time;

    const job = new CronJob(`*/${intervalInSeconds} * * * * *`, async () => {
      await this.robotService.runRobot(seller);
    });

    this.schedulerRegistry.addCronJob(jobName, job);
    job.start();
  }

  async resetCronJobs() {
    const sellers = await this.sellerService.getSellersWithRobots();

    const existingJobs = this.schedulerRegistry.getCronJobs();
    existingJobs.forEach((_, jobName) => {
      this.schedulerRegistry.deleteCronJob(jobName);
    });

    for (const seller of sellers) {
      this.addCronJobForSeller(seller);
    }
  }
}
