import { BaseEntity } from 'src/common/abstracts/base.entity';
import { EntityName } from 'src/common/enums/entity.enum';
import { Seller } from 'src/modules/sellers/entities/seller.entity';
import { Transaction } from 'src/modules/transactions/entities/transaction.entity';
import { Color } from 'src/modules/colors/entities/color.entity';
import { Column, Entity, ManyToOne, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { Category } from 'src/modules/categories/entities/categories.entity';

@Entity(EntityName.Products)
export class Product extends BaseEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'integer', nullable: true })
  price: number | null;

  @Column({ type: 'integer', nullable: true })
  quantity: number | null;

  @ManyToOne(() => Seller, (seller) => seller.products, { onDelete: 'CASCADE' })
  seller: Seller;

  @OneToMany(() => Transaction, (transaction) => transaction.product)
  transactions: Transaction[];

  @OneToOne(() => Color, (color) => color.product)
  @JoinColumn()
  color: Color;

  @OneToOne(() => Category, (category) => category.product)
  @JoinColumn()
  category: Category;
}
