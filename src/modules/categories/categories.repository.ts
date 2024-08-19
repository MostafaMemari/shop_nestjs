import { Injectable, ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Category } from './entities/categories.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoriesMessage } from 'src/common/enums/messages.enum';

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

  async findById(id: number) {
    const category = await this.findOneBy({ id });
    if (!category) throw new NotFoundException(CategoriesMessage.NotFoundCategory);
    return category;
  }
}
