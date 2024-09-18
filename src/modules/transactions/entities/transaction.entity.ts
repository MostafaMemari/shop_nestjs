import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, OneToMany } from 'typeorm';
import { TransactionType } from '../enum/transaction-type.enum';
import { Product } from 'src/modules/products/entities/product.entity';
import { User } from 'src/modules/users/entities/user.entity';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', nullable: true })
  price: number | null;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'enum', enum: TransactionType })
  type: TransactionType;

  @Column({ type: 'integer' })
  userId: number;

  @Column({ type: 'integer' })
  productId: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.transactions, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Product, (product) => product.transactions, { onDelete: 'CASCADE' })
  product: Product;
}
