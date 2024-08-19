import { Injectable, ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Color } from './entities/color.entity';
import { CreateColorDto } from './dto/create-color.dto';
import { UpdateColorDto } from './dto/update-color.dto';
import { ColorsMessage } from 'src/common/enums/messages.enum';

@Injectable()
export class ColorsRepository extends Repository<Color> {
  constructor(dataSource: DataSource) {
    super(Color, dataSource.createEntityManager());
  }

  async createColor({ name }: CreateColorDto): Promise<void> {
    const color = this.create({ name });
    try {
      await this.save(color);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(ColorsMessage.AlreadyExistsColor);
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
  async updateColor(id: number, { name }: UpdateColorDto): Promise<void> {
    try {
      await this.update(id, { name });
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(ColorsMessage.AlreadyExistsColor);
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async findById(id: number) {
    const color = await this.findOneBy({ id });
    if (!color) throw new NotFoundException(ColorsMessage.NotFoundColor);
    return color;
  }
}
