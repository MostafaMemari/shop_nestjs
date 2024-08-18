import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { swaggerConfigInit } from './config/swagger.config';

async function bootstrap() {
  const logger = new Logger();

  const app = await NestFactory.create(AppModule);
  const PORT = app.get(ConfigService).get<number>('PORT');

  app.setGlobalPrefix('api/v1');

  swaggerConfigInit(app);

  await app.listen(PORT, () => {
    logger.log(`Application listening on port ${PORT}`);
    console.log(`swagger : http://localhost:${PORT}/swagger`);
  });
}
bootstrap();
