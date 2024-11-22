import { JwtModuleOptions, JwtModuleAsyncOptions } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const jwtConfig = async (configService: ConfigService): Promise<JwtModuleOptions> => ({
  secret: configService.get<string>('JWT_SECRET'),
  signOptions: {
    expiresIn: Number(configService.get<string>('JWT_EXPIRES_IN')) * 365, // "60m" "60s"
  },
});

export const jwtConfigAsync: JwtModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: jwtConfig,
};
