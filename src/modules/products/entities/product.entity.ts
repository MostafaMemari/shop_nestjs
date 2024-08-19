import { BaseEntity } from 'src/common/abstracts/base.entity';
import { EntityName } from 'src/common/enums/entity.enum';
import { Column, Entity } from 'typeorm';

@Entity(EntityName.Products)
export class Product extends BaseEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'integer' })
  price: number;

  @Column({ type: 'integer' })
  quantity: number;
}
