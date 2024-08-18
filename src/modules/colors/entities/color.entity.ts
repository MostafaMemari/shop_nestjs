import { BaseEntity } from 'src/common/abstracts/base.entity';
import { EntityName } from 'src/common/enums/entity.enum';
import { Column, Entity } from 'typeorm';

@Entity(EntityName.Colors)
export class Color extends BaseEntity {
  @Column({ type: 'varchar', unique: true, nullable: false, length: 50 })
  name: string;
}
