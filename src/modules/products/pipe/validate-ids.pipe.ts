import { PipeTransform, Injectable, NotFoundException, Scope, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { formatErrorMessage } from 'src/common/utils/functions';
import { CategoriesService } from 'src/modules/categories/categories.service';
import { ColorsService } from 'src/modules/colors/colors.service';
import { SellerService } from 'src/modules/sellers/sellers.service';
import { EntityNotFoundError } from 'typeorm';

@Injectable({ scope: Scope.REQUEST })
export class ValidateIdsPipe implements PipeTransform {
  constructor(
    private readonly colorService: ColorsService,
    private readonly categoriesService: CategoriesService,
    private readonly sellerService: SellerService,
    @Inject(REQUEST) private readonly request: Request,
  ) {}

  async transform(value: any) {
    if (!value) {
      return value;
    }

    const { colorId, categoryId, sellerId } = value;
    try {
      if (colorId) await this.colorService.findOneById(colorId);
      if (categoryId) await this.categoriesService.findOneById(categoryId);
      if (sellerId) await this.sellerService.findOneById(sellerId, this.request.user);
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
