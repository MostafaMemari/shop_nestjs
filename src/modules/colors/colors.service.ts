import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateColorDto } from './dto/create-color.dto';
import { UpdateColorDto } from './dto/update-color.dto';
import { ColorsRepository } from './colors.repository';
import { ColorsMessage } from 'src/common/enums/messages.enum';

@Injectable()
export class ColorsService {
  constructor(private readonly colorRepository: ColorsRepository) {}

  async create(createColorDto: CreateColorDto) {
    await this.colorRepository.createColor(createColorDto);

    return {
      message: ColorsMessage.CreatedColorSuccess,
    };
  }

  async findAll() {
    return await this.colorRepository.find();
  }

  async findOneById(id: number) {
    const color = await this.colorRepository.findOneBy({ id });
    if (!color) throw new NotFoundException(ColorsMessage.NotFoundColor);
    return color;
  }

  async update(id: number, updateColorDto: UpdateColorDto) {
    await this.colorRepository.updateColor(id, updateColorDto);

    return {
      message: ColorsMessage.UpdatedColorSuccess,
    };
  }

  async remove(id: number) {
    const color = await this.colorRepository.delete({ id });
    if (color.affected === 0) throw new NotFoundException(ColorsMessage.NotFoundColor);

    return {
      message: ColorsMessage.RemoveColorSuccess,
    };
  }
}
