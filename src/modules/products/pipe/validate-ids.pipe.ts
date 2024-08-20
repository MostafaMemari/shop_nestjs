import { PipeTransform, Injectable, NotFoundException } from '@nestjs/common';
import { formatErrorMessage } from 'src/common/utils/functions';
import { CategoriesRepository } from 'src/modules/categories/categories.repository';
import { ColorsRepository } from 'src/modules/colors/colors.repository';
import { SellersRepository } from 'src/modules/sellers/seller.repository';
import { EntityNotFoundError } from 'typeorm';

@Injectable()
export class ValidateIdsPipe implements PipeTransform {
  constructor(
    private readonly colorsRepository: ColorsRepository,
    private readonly categoryRepository: CategoriesRepository,
    private readonly sellersRepository: SellersRepository,
  ) {}

  async transform(value: any) {
    try {
      await this.colorsRepository.findOneByOrFail({ id: value.colorId });
      await this.categoryRepository.findOneByOrFail({ id: value.categoryId });
      await this.sellersRepository.findOneByOrFail({ id: value.sellerId });
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new NotFoundException(formatErrorMessage(error.message));
      }
      throw error;
    }
    return value;
  }
}
