import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { UsersRepository } from './users.repository';
import { RegisterDto } from '../auth/dto/register.dto';
import { AuthMessage } from 'src/common/enums/messages.enum';
import { HashUtil } from 'src/common/utils/hash.util';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async findByEmail(email: string): Promise<User> {
    return this.usersRepository.findOneBy({ email });
  }
  async findUserByEmailOrUsername(identifier: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: [{ email: identifier }, { username: identifier }],
      select: { password: true, email: true, id: true, role: true },
    });
    if (!user) throw new NotFoundException(AuthMessage.NotFoundAccount);

    return user;
  }

  async create(registerDto: RegisterDto): Promise<User> {
    const { email, password, username } = registerDto;

    const hashedPassword = await HashUtil.hashPassword(password);
    const user = this.usersRepository.create({ email, password: hashedPassword, username });

    return this.usersRepository.save(user);
  }
}
