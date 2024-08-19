import { BaseEntity } from 'src/common/abstracts/base.entity';
import { EntityName } from 'src/common/enums/entity.enum';
import { Product } from 'src/modules/products/entities/product.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

@Entity(EntityName.Colors)
export class Color extends BaseEntity {
  @Column({ type: 'varchar', unique: true, nullable: false, length: 50 })
  name: string;

  @OneToOne(() => Product, (product) => product.color)
  product: Product;
}
