import { BaseEntity } from 'src/common/abstracts/base.entity';
import { EntityName } from 'src/common/enums/entity.enum';
import { Seller } from 'src/modules/sellers/entities/seller.entity';
import { Transaction } from 'src/modules/transactions/entities/transaction.entity';
import { Color } from 'src/modules/colors/entities/color.entity';
import { Column, Entity, ManyToOne, OneToMany, JoinColumn, OneToOne } from 'typeorm';
import { Category } from 'src/modules/categories/entities/categories.entity';
import { ProductSettings } from './product-settings.entity';

@Entity(EntityName.Products)
export class Product extends BaseEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'integer', nullable: true })
  price: number | null;

  @Column({ type: 'integer', nullable: true })
  quantity: number | null;

  @Column({ type: 'integer', nullable: true })
  height: number | null;

  @Column({ type: 'integer', nullable: true })
  width: number | null;

  @Column({ type: 'integer' })
  dkp: number;

  @Column({ type: 'integer' })
  dkpc: number;

  @Column({ type: 'boolean', default: true })
  status: boolean;

  @ManyToOne(() => Seller, (seller) => seller.products, { onDelete: 'CASCADE' })
  @JoinColumn()
  seller: Seller;

  @OneToMany(() => Transaction, (transaction) => transaction.product, { cascade: true })
  transactions: Transaction[];

  @ManyToOne(() => Color, (color) => color.products, { nullable: false })
  @JoinColumn()
  color: Color;

  @ManyToOne(() => Category, (category) => category.products, { nullable: false })
  @JoinColumn()
  category: Category;

  @OneToOne(() => ProductSettings, (ProductSettings) => ProductSettings.product, { cascade: true })
  product_settings: ProductSettings;
}
