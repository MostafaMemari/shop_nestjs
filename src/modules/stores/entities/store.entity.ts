import { BaseEntity } from 'src/common/abstracts/base.entity';
import { EntityName } from 'src/common/enums/entity.enum';
import { Column, CreateDateColumn, Entity } from 'typeorm';

@Entity(EntityName.Stores)
export class Store extends BaseEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'text' })
  address: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
}
