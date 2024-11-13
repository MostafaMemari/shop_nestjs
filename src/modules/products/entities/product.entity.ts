import { BaseEntity } from 'src/common/abstracts/base.entity';
import { EntityName } from 'src/common/enums/entity.enum';
import { Seller } from 'src/modules/sellers/entities/seller.entity';
import { Color } from 'src/modules/colors/entities/color.entity';
import { Column, Entity, ManyToOne, OneToMany, JoinColumn, OneToOne, UpdateDateColumn } from 'typeorm';
import { Category } from 'src/modules/categories/entities/categories.entity';
import { ProductSettings } from './settings-product.entity';
import { Transaction } from 'src/modules/transactions/entities/transaction.entity';
import { RelatedProduct } from './related-product.entity';
import { ProductType } from '../enum/productType.enum';

@Entity(EntityName.Products)
export class Product extends BaseEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  image: string | null;

  @Column({ type: 'varchar', nullable: true })
  image_key: string | null;

  @Column({ type: 'numeric', nullable: true })
  price: number | null;

  @Column({ type: 'integer', default: 0 })
  stock: number;

  @Column('decimal', {
    precision: 5,
    scale: 1,
    nullable: true,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => (value ? parseFloat(value) : null),
    },
  })
  height: number | null;

  @Column('decimal', {
    precision: 5,
    scale: 1,
    nullable: true,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => (value ? parseFloat(value) : null),
    },
  })
  width: number | null;

  @Column({ type: 'enum', enum: ProductType, default: ProductType.SINGLE })
  type: ProductType;

  @Column({ type: 'integer' })
  dkp: number;

  @Column({ type: 'integer' })
  dkpc: number;

  @Column({ type: 'integer', nullable: true })
  categoryId: number;

  @Column({ type: 'integer' })
  sellerId: number;

  @Column({ type: 'integer', nullable: true })
  colorId: number;

  @Column({ type: 'boolean', default: true })
  status: boolean;

  @Column({ type: 'boolean', default: false })
  is_robot: boolean;

  @ManyToOne(() => Seller, (seller) => seller.products, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn()
  seller: Seller;

  @OneToMany(() => Transaction, (transaction) => transaction.product, { cascade: true })
  transactions: Transaction[];

  @ManyToOne(() => Color, (color) => color.products, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn()
  color: Color;

  @ManyToOne(() => Category, (category) => category.products, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn()
  category: Category;

  @OneToOne(() => ProductSettings, (ProductSettings) => ProductSettings.product, { cascade: true })
  product_settings: ProductSettings;

  @OneToMany(() => RelatedProduct, (relatedProduct) => relatedProduct.parentProduct)
  relatedProducts: RelatedProduct[];

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
