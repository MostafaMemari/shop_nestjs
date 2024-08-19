import { BaseEntity } from 'src/common/abstracts/base.entity';
import { EntityName } from 'src/common/enums/entity.enum';
import { Store } from 'src/modules/stores/entities/store.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

@Entity(EntityName.Sellers)
export class Seller extends BaseEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  email: string;

  @Column({ type: 'varchar', nullable: true })
  phone: string;

  @OneToOne(() => Store, (store) => store.seller, { cascade: true })
  @JoinColumn()
  store: Store;
}
