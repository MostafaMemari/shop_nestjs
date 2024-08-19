import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './strategy/jwt.strategy';
import { jwtConfigAsync } from 'src/config/jwt.config';
import { UsersRepository } from '../users/users.repository';

@Module({
  imports: [UsersModule, PassportModule.register({ defaultStrategy: 'jwt' }), JwtModule.registerAsync(jwtConfigAsync)],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, UsersRepository],
  exports: [AuthService],
})
export class AuthModule {}
