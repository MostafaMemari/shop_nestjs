import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoriesMessage } from './messages/categories.messages';
import { CategoriesRepository } from './categories.repository';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoryRepository: CategoriesRepository) {}

  async create(createCategoryDto: CreateCategoryDto) {
    await this.categoryRepository.createCategory(createCategoryDto);

    return {
      message: CategoriesMessage.CreatedCategorySuccess,
    };
  }

  async findAll() {
    return await this.categoryRepository.find();
  }

  async findOneById(id: number) {
    const category = await this.categoryRepository.findOneBy({ id });
    if (!category) throw new ConflictException(CategoriesMessage.NotFoundCategory);
    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    await this.categoryRepository.updateCategory(id, updateCategoryDto);

    return {
      message: CategoriesMessage.UpdatedCategorySuccess,
    };
  }

  async remove(id: number) {
    const category = await this.categoryRepository.delete({ id });
    if (category.affected === 0) throw new NotFoundException(CategoriesMessage.NotFoundCategory);

    return {
      message: CategoriesMessage.RemoveCategorySuccess,
    };
  }
}
