import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { DigikalaService } from '../http/DigiKala/digikala.service';
import { Seller } from '../sellers/entities/seller.entity';
import { SellerService } from '../sellers/sellers.service';
import { ProductsService } from '../products/products.service';

@Injectable()
export class RobotService {
  constructor(
    private readonly digiKalaService: DigikalaService,
    @Inject(forwardRef(() => ProductsService)) private readonly productsService: ProductsService,
  ) {}

  async runRobot(seller?: Seller): Promise<void> {
    // const products = await this.digiKalaService.getProductNotBuyBoxBySeller();
    const productDigiKala = await this.digiKalaService.getProductDigiKalaByDKP(17062606);
    console.log(productDigiKala);
  }
}
