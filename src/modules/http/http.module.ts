import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { DigikalaService } from './DigiKala/digikala.service';

@Global()
@Module({
  imports: [
    HttpModule.register({
      timeout: 10000,
    }),
  ],
  providers: [DigikalaService],
  exports: [DigikalaService],
})
export class CustomHttpModule {}
