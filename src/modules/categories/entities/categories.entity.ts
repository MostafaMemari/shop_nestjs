import { BaseEntity } from 'src/common/abstracts/base.entity';
import { EntityName } from 'src/common/enums/entity.enum';
import { Product } from 'src/modules/products/entities/product.entity';
import { Column, Entity, OneToOne } from 'typeorm';

@Entity(EntityName.Categories)
export class Category extends BaseEntity {
  @Column({ type: 'varchar', unique: true, nullable: false, length: 50 })
  name: string;

  @OneToOne(() => Product, (product) => product.category)
  product: Product;
}
