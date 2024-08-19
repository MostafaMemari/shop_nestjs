import { BaseEntity } from 'src/common/abstracts/base.entity';
import { EntityName } from 'src/common/enums/entity.enum';
import { Product } from 'src/modules/products/entities/product.entity';
import { Seller } from 'src/modules/sellers/entities/seller.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';

@Entity(EntityName.Stores)
export class Store extends BaseEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'text' })
  address: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @OneToMany(() => Product, (product) => product.store)
  products: Product[];

  @ManyToOne(() => User, (user) => user.stores)
  owner: User;

  @OneToOne(() => Seller, (seller) => seller.store)
  seller: Seller;
}
