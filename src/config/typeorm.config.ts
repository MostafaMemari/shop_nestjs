// typeorm.config.ts
import { TypeOrmModuleOptions, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const typeOrmConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get<string>('DB_HOST'),
  port: Number(configService.get<number>('DB_PORT')),
  username: configService.get<string>('DB_USERNAME'),
  password: configService.get<string>('DB_PASSWORD'),
  database: configService.get<string>('DB_NAME'),
  autoLoadEntities: true,
  synchronize: configService.get('NODE_ENV') !== 'production',
  ssl: configService.get('NODE_ENV') === 'production',
  extra: configService.get('NODE_ENV') === 'production' ? { ssl: { rejectUnauthorized: false } } : null,
});

export const typeOrmConfigAsync: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: typeOrmConfig,
};
