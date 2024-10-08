import { BaseEntity } from 'src/common/abstracts/base.entity';
import { EntityName } from 'src/common/enums/entity.enum';
import { Product } from 'src/modules/products/entities/product.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity(EntityName.Sellers)
export class Seller extends BaseEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  email: string;

  @Column({ type: 'varchar', nullable: true })
  phone: string;

  @ManyToOne(() => User, (user) => user.sellers, { onDelete: 'SET NULL', nullable: false })
  user: User;

  @OneToMany(() => Product, (product) => product.seller)
  products: Product[];
}
