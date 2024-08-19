import { Injectable } from '@nestjs/common';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { StoreRepository } from './stores.repository';
import { User } from '../users/entities/user.entity';
import { StoresMessage } from 'src/common/enums/messages.enum';

@Injectable()
export class StoresService {
  constructor(private storeRepository: StoreRepository) {}

  async create(createStoreDto: CreateStoreDto, user: User) {
    await this.storeRepository.createStore(createStoreDto, user);

    return {
      message: StoresMessage.CreatedStoreSuccess,
    };
  }

  findAll() {
    return `This action returns all stores`;
  }

  findOne(id: number) {
    return `This action returns a #${id} store`;
  }

  update(id: number, updateStoreDto: UpdateStoreDto) {
    return `This action updates a #${id} store`;
  }

  remove(id: number) {
    return `This action removes a #${id} store`;
  }
}
