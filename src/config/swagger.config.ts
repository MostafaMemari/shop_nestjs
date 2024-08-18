import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SecuritySchemeObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

export const swaggerConfigInit = (app: INestApplication): void => {
  const swaggerConfig = new DocumentBuilder()
    .setTitle('shop manager')
    .setDescription('Shop Manager NestJs')
    .setVersion('0.0.1')
    .addServer('/api/v1')
    .addBearerAuth(swaggerAuthConfig(), 'Authorization')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig, {
    ignoreGlobalPrefix: true,
  });

  SwaggerModule.setup('/swagger', app, document, {
    jsonDocumentUrl: 'swagger/json',
  });
};

function swaggerAuthConfig(): SecuritySchemeObject {
  return {
    type: 'http',
    bearerFormat: 'JWT',
    in: 'header',
    scheme: 'bearer',
  };
}

// .addCookieAuth('accessToken', swaggerAuthConfig(), 'authorization')

// function SwaggerAuthConfig(): SecuritySchemeObject {
//   return {
//      scheme: 'cookie',
//      type: 'http',
//      in: 'header',
//      bearerFormat: 'JWT',
//   };
// }
