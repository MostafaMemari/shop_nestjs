import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { DigikalaService } from '../http/DigiKala/digikala.service';
import { Seller } from '../sellers/entities/seller.entity';
import { SellerService } from '../sellers/sellers.service';

@Injectable()
export class RobotService {
  constructor(
    private readonly digiKalaService: DigikalaService,
    @Inject(forwardRef(() => SellerService)) private readonly sellerService: SellerService,
  ) {}

  async runRobot(seller: Seller): Promise<void> {
    const varinats = await this.digiKalaService.getVariants(seller.api_key, {
      'search[is_buy_box_winner]': 0,
      size: 100,
    });
    console.log(varinats);
  }
}
