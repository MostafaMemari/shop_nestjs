import { Injectable } from '@nestjs/common';
import { DigikalaService } from '../http/DigiKala/digikala.service';

@Injectable()
export class RobotService {
  constructor(private readonly httpService: DigikalaService) {}

  async fetchAndProcessData(): Promise<void> {
    try {
      const data = await this.httpService.getVariants(
        `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzM4NCJ9.eyJ0b2tlbl9pZCI6MTA4NjgsInBheWxvYWQiOm51bGx9.gZAiguu0btiWXBobziPizvqDlklVxraKom6EG3I1fnvO99wYb0cECSaMiQb2hf_n`,
      );

      return data;
      // TODO: اعمال تغییرات لازم
    } catch (error) {
      console.error('Error processing data:', error.message);
    }
  }
}
