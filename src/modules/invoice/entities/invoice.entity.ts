import { Entity, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { InvoiceItem } from './invoice-item.entity';
import { BaseEntity } from 'src/common/abstracts/base.entity';
import { InvoiceStatus, InvoiceType } from '../enum/Invoice.enum';



@Entity()
export class Invoice extends BaseEntity {
  @CreateDateColumn()
  date: Date;

  @Column()
  total_amount: number; 

  @Column({
    type: 'enum',
    enum: InvoiceType,
  })
  type: InvoiceType;

  @Column({
    type: 'enum',
    enum: InvoiceStatus,
    default: InvoiceStatus.SUCCESS,
  })
  status: InvoiceStatus;

  @OneToMany(() => InvoiceItem, (invoiceItem) => invoiceItem.invoice, { cascade: true })
  items: InvoiceItem[];
}
