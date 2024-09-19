import { Module } from '@nestjs/common';
import { AwsService } from './aws.service';
import { awsController } from './aws.controller';

@Module({
  providers: [AwsService],
  controllers: [awsController],
  exports: [AwsService],
})
export class AwsModule {}
