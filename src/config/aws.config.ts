// src/config/aws-sdk.config.ts
import { S3 } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { AwsServiceConfigurationOptionsFactory } from 'nest-aws-sdk';

export const awsSdkConfigFactory = (configService: ConfigService): AwsServiceConfigurationOptionsFactory => ({
  region: configService.get<string>('AWS_REGION'),
  credentials: {
    accessKeyId: configService.get<string>('AWS_ACCESS_KEY_ID'),
    secretAccessKey: configService.get<string>('AWS_SECRET_ACCESS_KEY'),
  },
  endpoint: configService.get<string>('AWS_ENDPOINT'),
});

export const awsSdkConfigAsync = {
  defaultServiceOptions: {
    inject: [ConfigService],
    useFactory: awsSdkConfigFactory,
  },
  services: [S3],
};
