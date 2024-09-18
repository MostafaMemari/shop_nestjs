import { Entity,  Column, ManyToOne } from 'typeorm';
import { Invoice } from './invoice.entity';
import { BaseEntity } from 'src/common/abstracts/base.entity';
import { ItemStatus } from '../enum/Invoice.enum';



@Entity()
export class InvoiceItem extends BaseEntity {
  @Column()
  product_name: string;

  @Column()
  quantity: number; 

  @Column()
  price: number;

  @Column({
    type: 'enum',
    enum: ItemStatus,
    default: ItemStatus.SUCCESS, 
  })
  status: ItemStatus; 

  @ManyToOne(() => Invoice, (invoice) => invoice.items)
  invoice: Invoice;
}
