import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { UserRepository } from './users.repository';
import { RegisterDto } from '../auth/dto/register.dto';
import { AuthMessage } from 'src/common/enums/messages.enum';
import { HashUtil } from 'src/common/utils/hash.util';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async findByEmail(email: string): Promise<User> {
    return this.userRepository.findOneBy({ email });
  }
  async findUserByEmailAndUsername(identifier: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: [{ email: identifier }, { username: identifier }],
      select: { password: true, email: true, id: true, role: true },
    });
    if (!user) throw new NotFoundException(AuthMessage.NotFoundAccount);

    return user;
  }

  async create(registerDto: RegisterDto): Promise<User> {
    const { email, password, username } = registerDto;

    const hashedPassword = await HashUtil.hashPassword(password);
    const user = this.userRepository.create({ email, password: hashedPassword, username });

    return this.userRepository.save(user);
  }
}
