import { PipeTransform, Injectable, NotFoundException } from '@nestjs/common';
import { formatErrorMessage } from 'src/common/utils/functions';
import { CategoriesRepository } from 'src/modules/categories/categories.repository';
import { CategoriesService } from 'src/modules/categories/categories.service';
import { ColorsRepository } from 'src/modules/colors/colors.repository';
import { ColorsService } from 'src/modules/colors/colors.service';
import { SellersRepository } from 'src/modules/sellers/seller.repository';
import { SellerService } from 'src/modules/sellers/sellers.service';
import { EntityNotFoundError } from 'typeorm';

@Injectable()
export class ValidateIdsPipe implements PipeTransform {
  constructor(
    private readonly colorService: ColorsService,
    private readonly categoriesService: CategoriesService,
    private readonly sellerService: SellerService,
  ) {}

  async transform(value: any) {
    try {
      await this.colorService.findById(value.colorId);
      await this.categoriesService.findById(value.categoryId);
      await this.sellerService.findById(value.sellerId);
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new NotFoundException(formatErrorMessage(error.message));
      }
      throw error;
    }
    return value;
  }
}

// async transform(value: any) {
//   try {
//     await this.colorsRepository.findOneByOrFail({ id: value.colorId });
//     await this.categoryRepository.findOneByOrFail({ id: value.categoryId });
//     await this.sellersRepository.findOneByOrFail({ id: value.sellerId });
//   } catch (error) {
//     if (error instanceof EntityNotFoundError) {
//       throw new NotFoundException(formatErrorMessage(error.message));
//     }
//     throw error;
//   }
//   return value;
// }
