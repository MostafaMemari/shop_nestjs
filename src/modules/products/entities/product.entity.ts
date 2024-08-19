import { BaseEntity } from 'src/common/abstracts/base.entity';
import { EntityName } from 'src/common/enums/entity.enum';
import { Category } from 'src/modules/categories/entities/categories.entity';
import { Color } from 'src/modules/colors/entities/color.entity';
import { Store } from 'src/modules/stores/entities/store.entity';
import { Transaction } from 'src/modules/transactions/entities/transaction.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';

@Entity(EntityName.Products)
export class Product extends BaseEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'integer' })
  price: number;

  @Column({ type: 'integer' })
  quantity: number;

  @ManyToOne(() => User, (user) => user.products)
  user: User;

  @ManyToOne(() => Store, (store) => store.products)
  store: Store;

  @OneToMany(() => Transaction, (transaction) => transaction.product)
  transactions: Transaction[];

  @OneToOne(() => Color, (color) => color.product)
  @JoinColumn()
  color: Color;

  @OneToOne(() => Category, (category) => category.product)
  @JoinColumn()
  category: Category;
}
