import { Injectable, Logger } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Store } from './entities/store.entity';
import { CreateStoreDto } from './dto/create-store.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class StoreRepository extends Repository<Store> {
  constructor(dataSource: DataSource) {
    super(Store, dataSource.createEntityManager());
  }

  async createStore(createStoreDto: CreateStoreDto, user: User) {
    const { name, address } = createStoreDto;

    const store = this.create({ name, address, owner: user });

    try {
      await this.save(store);
    } catch (error) {
      console.log(error.message);
    }
  }
}
