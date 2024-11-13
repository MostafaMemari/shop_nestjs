import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Product } from './product.entity';
import { BaseEntity } from 'src/common/abstracts/base.entity';

@Entity()
export class RelatedProduct extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, (product) => product.relatedProducts, { onDelete: 'CASCADE' })
  parentProduct: Product;

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  childProduct: Product;

  @Column('int')
  quantity: number;
}
