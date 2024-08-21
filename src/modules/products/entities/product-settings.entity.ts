import { BaseEntity } from 'src/common/abstracts/base.entity';
import { EntityName } from 'src/common/enums/entity.enum';
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Product } from './product.entity';

@Entity(EntityName.ProductSettings)
export class ProductSettings extends BaseEntity {
  @Column({ type: 'integer', default: 0 })
  reduce_price: number;

  @Column({ type: 'integer', default: 0 })
  min_price: number;

  @Column({ type: 'boolean', default: false })
  is_active: boolean;

  @Column({ type: 'boolean', default: false })
  is_buyBox: boolean;

  @Column({ type: 'boolean', default: false })
  is_check_price: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @CreateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @OneToOne(() => Product, (product) => product.product_settings)
  @JoinColumn()
  product: Product;
}
