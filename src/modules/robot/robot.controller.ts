import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RobotService } from './robot.service';

@Controller('robot')
@ApiTags('robot')
export class RobotController {
  constructor(private readonly robotService: RobotService) {}

  @Get()
  findAll(): any {
    return this.robotService.fetchAndProcessData();
  }
}
