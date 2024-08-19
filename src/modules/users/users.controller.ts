import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @Get(':email')
  // async findOne(@Param('email') email: string): Promise<User> {
  //   return this.usersService.findByEmail(email);
  // }
}
