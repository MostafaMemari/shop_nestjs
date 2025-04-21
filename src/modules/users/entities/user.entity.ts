import { Exclude } from 'class-transformer';
import { BaseEntity } from 'src/common/abstracts/base.entity';
import { EntityName } from 'src/common/enums/entity.enum';
import { Roles } from 'src/common/enums/role.enum';
import { Seller } from 'src/modules/sellers/entities/seller.entity';
import { Transaction } from 'src/modules/transactions/entities/transaction.entity';
import { Column, CreateDateColumn, Entity, OneToMany } from 'typeorm';

@Entity(EntityName.Users)
export class User extends BaseEntity {
  @Column({ type: 'varchar', length: 40, nullable: false, unique: true })
  username: string;

  @Column({ type: 'varchar', nullable: false, unique: true })
  email: string;

  @Column({ type: 'varchar', nullable: false })
  first_name: string;

  @Column({ type: 'varchar', nullable: false })
  last_name: string;

  @Column({ type: 'varchar', select: false, nullable: true })
  @Exclude()
  password?: string;

  @Column({ type: 'enum', enum: Roles, default: Roles.User })
  role: Roles;

  @Column({ nullable: true })
  hashedRefreshToken?: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @OneToMany(() => Seller, (seller) => seller.user)
  sellers: Seller[];

  @OneToMany(() => Transaction, (transaction) => transaction.user)
  transactions: Transaction[];
}
