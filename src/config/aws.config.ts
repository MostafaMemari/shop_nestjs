import { S3 } from 'aws-sdk';
import {
  AwsService,
  AwsServiceConfigurationOptionsFactory,
  AwsServiceType,
  AwsServiceWithServiceOptions,
} from 'nest-aws-sdk';

export const awsSdkConfig = (): {
  defaultServiceOptions?: AwsServiceConfigurationOptionsFactory;
  services?: Array<AwsServiceType<AwsService> | AwsServiceWithServiceOptions>;
} => {
  return {
    defaultServiceOptions: {
      region: 'default',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
      endpoint: process.env.AWS_ENDPOINT,
    },
    services: [S3],
  };
};
