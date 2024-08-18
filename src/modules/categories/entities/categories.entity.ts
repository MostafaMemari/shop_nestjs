import { BaseEntity } from 'src/common/abstracts/base.entity';
import { EntityName } from 'src/common/enums/entity.enum';
import { Column, Entity } from 'typeorm';

@Entity(EntityName.Categories)
export class Category extends BaseEntity {
  @Column({ type: 'varchar', unique: true, nullable: false, length: 50 })
  name: string;
}
