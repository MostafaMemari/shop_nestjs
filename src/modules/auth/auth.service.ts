import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { HashUtil } from 'src/common/utils/hash.util';
import { instanceToPlain, plainToClass } from 'class-transformer';
import { CurrentUser } from './types/current-user';
import { AuthJwtPayload } from './types/auth-jwtPayload';
import { ConfigType } from '@nestjs/config';
import refreshJwtConfig from '../../config/refresh-jwt.config';
import * as argon2 from 'argon2';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @Inject(refreshJwtConfig.KEY)
    private refreshTokenConfig: ConfigType<typeof refreshJwtConfig>,
  ) {}

  async login(loginDto: LoginDto): Promise<{ id: number; accessToken: string; refreshToken: string }> {
    const user = await this.validateUser(loginDto.identifier, loginDto.password);

    const { accessToken, refreshToken } = await this.generateTokens(user.id);

    const hashedRefreshToken = await argon2.hash(refreshToken);
    await this.usersService.updateRefreshToken(user.id, hashedRefreshToken);

    return {
      id: user.id,
      accessToken,
      refreshToken,
    };
  }
  async register(registerDto: RegisterDto): Promise<{ user: User; accessToken: string; refreshToken: string }> {
    await this.usersService.checkExistUserByEmail(registerDto.email);
    await this.usersService.checkExistUserByUsername(registerDto.username);
    const user = await this.usersService.create(registerDto);

    const { accessToken, refreshToken } = await this.generateTokens(user.id);

    const hashedRefreshToken = await argon2.hash(refreshToken);
    await this.usersService.updateRefreshToken(user.id, hashedRefreshToken);

    await this.usersService.updateRefreshToken(user.id, refreshToken);

    const userWithoutPassword = instanceToPlain(user) as User;
    return { user: userWithoutPassword, accessToken, refreshToken };
  }
  async generateTokens(userId: number) {
    const payload: AuthJwtPayload = { sub: userId };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, this.refreshTokenConfig),
    ]);
    return {
      accessToken,
      refreshToken,
    };
  }

  async validateUser(identifier: string, password: string): Promise<User> {
    const user = await this.usersService.findUserByEmailOrUsername(identifier);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    if (user && (await HashUtil.compareHash(password, user.password))) {
      return plainToClass(User, user);
    }
    return null;
  }
  async validateUserById(id: number): Promise<CurrentUser> {
    const user = await this.usersService.findOneById(id);
    if (!user) throw new UnauthorizedException('User not found!');
    const currentUser: CurrentUser = { id: user.id, role: user.role };
    return currentUser;
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const payload = await this.jwtService.verifyAsync(refreshTokenDto.refreshToken, {
        secret: process.env.REFRESH_JWT_SECRET,
      });

      const { userId } = await this.validateRefreshToken(payload.sub, refreshTokenDto.refreshToken);

      const { accessToken: newAccessToken, refreshToken: newRefreshToken } = await this.generateTokens(userId);

      // Update refresh token in database
      const hashedRefreshToken = await argon2.hash(newRefreshToken);
      await this.usersService.updateRefreshToken(userId, hashedRefreshToken);

      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async validateRefreshToken(userId: number, refreshToken: string) {
    const user = await this.usersService.findOneById(userId);

    if (!user || !user.hashedRefreshToken) throw new UnauthorizedException('Invalid Refresh Token');

    const refreshTokenMatches = await argon2.verify(user.hashedRefreshToken, refreshToken);

    if (!refreshTokenMatches) throw new UnauthorizedException('Invalid Refresh Token');

    return { userId };
  }

  async logout(userId: number): Promise<void> {
    await this.usersService.updateRefreshToken(userId, null);
  }
}
