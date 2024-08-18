import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Color } from './entities/color.entity';
import { CreateColorDto } from './dto/create-color.dto';
import { ColorsMessage } from './messages/colors.messages';
import { UpdateColorDto } from './dto/update-color.dto';

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
}
