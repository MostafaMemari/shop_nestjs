import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { RegisterDto } from './dto/register.dto';
import { HashUtil } from 'src/common/utils/hash.util';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
    const user = await this.validateUser(loginDto.identifier, loginDto.password);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const payload: JwtPayload = { id: user.id, role: user.role };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken };
  }

  async register(registerDto: RegisterDto): Promise<User> {
    return this.usersService.create(registerDto);
  }

  async validateUser(identifier: string, password: string): Promise<User> {
    const user = await this.usersService.findUserByEmailOrUsername(identifier);
    if (user && (await HashUtil.compareHash(password, user.password))) {
      return user;
    }
    return null;
  }
}
