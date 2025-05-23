import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { UsersRepository } from './users.repository';
import { RegisterDto } from '../auth/dto/register.dto';
import { AuthMessage } from 'src/common/enums/messages.enum';
import { HashUtil } from 'src/common/utils/hash.util';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async findByEmail(email: string): Promise<User> {
    return await this.usersRepository.findOneBy({ email });
  }

  async findUserByEmailOrUsername(identifier: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: [{ email: identifier }, { username: identifier }],
      // select: { password: true, email: true, id: true, role: true },
      select: ['password', 'email', 'id', 'role'],
    });
    if (!user) throw new NotFoundException(AuthMessage.NotFoundAccount);

    return user;
  }

  async checkExistUserByEmail(email: string) {
    const user = await this.usersRepository.findOneBy({ email });
    if (user) throw new ConflictException(AuthMessage.AlreadyExistAccount);
  }
  async checkExistUserByUsername(username: string) {
    const user = await this.usersRepository.findOneBy({ username });
    if (user) throw new ConflictException(AuthMessage.AlreadyExistAccount);
  }

  async create(registerDto: RegisterDto): Promise<User> {
    const { password } = registerDto;

    const hashedPassword = await HashUtil.hashPassword(password);
    const user = this.usersRepository.create({ ...registerDto, password: hashedPassword });

    return this.usersRepository.save(user);
  }

  async updateRefreshToken(userId: number, hashedRefreshToken: string | null): Promise<void> {
    await this.usersRepository.update({ id: userId }, { hashedRefreshToken });
  }

  async findOneById(id: number): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }
}
