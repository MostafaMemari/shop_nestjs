import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { User } from 'src/modules/users/entities/user.entity';
import { UsersRepository } from 'src/modules/users/users.repository';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    private usersRepository: UsersRepository,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('REFRESH_JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const { sub: id } = payload;
    const user: User | null =
      (await this.usersRepository.findOne({
        where: { id },
        select: { id: true, username: true, role: true, hashedRefreshToken: true },
      })) ?? null;

    if (!user || !user.hashedRefreshToken) throw new UnauthorizedException();
    // req.user = user;

    return user;
  }
}
