import { BaseEntity } from 'src/common/abstracts/base.entity';
import { EntityName } from 'src/common/enums/entity.enum';
import { Roles } from 'src/common/enums/role.enum';
import { Product } from 'src/modules/products/entities/product.entity';
import { Column, CreateDateColumn, Entity, OneToMany } from 'typeorm';

@Entity(EntityName.Users)
export class User extends BaseEntity {
  @Column({ type: 'varchar', length: 40, nullable: false, unique: true })
  username: string;

  @Column({ type: 'varchar', nullable: false, unique: true })
  email: string;

  @Column({ type: 'varchar', select: false, nullable: true })
  password?: string;

  @Column({ type: 'enum', enum: Roles, default: Roles.User })
  role: Roles;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @OneToMany(() => Product, (product) => product.user)
  products: Product[];
}
