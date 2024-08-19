import { BaseEntity } from 'src/common/abstracts/base.entity';
import { EntityName } from 'src/common/enums/entity.enum';
import { Column, CreateDateColumn, Entity } from 'typeorm';
import { TransactionType } from '../enums/transaction-type.enum';

@Entity(EntityName.Transaction)
export class Transaction extends BaseEntity {
  @Column({ type: 'enum', enum: TransactionType })
  type: TransactionType;

  @Column({ type: 'integer' })
  quantity: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
}
