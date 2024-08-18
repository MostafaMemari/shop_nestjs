import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Category } from './entities/categories.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoriesMessage } from './messages/categories.messages';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesRepository extends Repository<Category> {
  constructor(dataSource: DataSource) {
    super(Category, dataSource.createEntityManager());
  }

  async createCategory({ name }: CreateCategoryDto): Promise<void> {
    const category = this.create({ name });
    try {
      await this.save(category);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(CategoriesMessage.AlreadyExistsCategory);
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
  async updateCategory(id: number, { name }: UpdateCategoryDto): Promise<void> {
    try {
      await this.update(id, { name });
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(CategoriesMessage.AlreadyExistsCategory);
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
