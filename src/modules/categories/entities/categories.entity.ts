import { BaseEntity } from 'src/common/abstracts/base.entity';
import { EntityName } from 'src/common/enums/entity.enum';
import { Product } from 'src/modules/products/entities/product.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity(EntityName.Categories)
export class Category extends BaseEntity {
  @Column({ type: 'varchar', unique: true, nullable: false, length: 50 })
  name: string;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
}
