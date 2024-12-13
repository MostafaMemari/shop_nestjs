import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthDecorator } from 'src/common/decorators/auth.decorator';
import { RobotService } from './robot.service';

@Controller('robot')
@ApiTags('robot')
@AuthDecorator()
export class RobotController {
  constructor(private readonly robotService: RobotService) {}

  @Get(':id')
  start() {
    return this.robotService.runRobot();
  }
}
