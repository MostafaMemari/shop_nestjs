import { Controller, Post, Body, HttpCode, Get, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '../users/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { SwaggerConsumes } from 'src/common/enums/swagger-consumes.enum';
import { RegisterDto } from './dto/register.dto';
import { AuthDecorator } from 'src/common/decorators/auth.decorator';
import { Request } from 'express';

@Controller('auth')
@ApiTags('Authorisation')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  async login(@Body() loginDto: LoginDto): Promise<{ accessToken: string }> {
    return this.authService.login(loginDto);
  }

  @Post('register')
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  async register(@Body() registerDto: RegisterDto): Promise<{ accessToken: string }> {
    return this.authService.register(registerDto);
  }

  @AuthDecorator()
  @Get('me')
  async me(@Req() req: Request): Promise<User> {
    const user = req.user as User;
    return user;
  }
}
