import { BaseEntity } from 'src/common/abstracts/base.entity';
import { EntityName } from 'src/common/enums/entity.enum';
import { Product } from 'src/modules/products/entities/product.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { AfterUpdate, BeforeUpdate, Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity(EntityName.Sellers)
export class Seller extends BaseEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'integer' })
  seller_id: number;

  @Column({ type: 'varchar', nullable: true })
  email: string;

  @Column({ type: 'varchar', nullable: true })
  phone: string;

  @Column({ type: 'varchar', nullable: true })
  api_key: string;

  @Column({ type: 'varchar', nullable: true })
  access_token: string;

  @Column({ type: 'boolean', default: false })
  is_robot: boolean;

  @Column({ type: 'numeric', nullable: true })
  robot_start_time: number;

  @ManyToOne(() => User, (user) => user.sellers, { onDelete: 'SET NULL', nullable: false })
  user: User;

  @OneToMany(() => Product, (product) => product.seller)
  products: Product[];

  @BeforeUpdate()
  beforeUpdate() {
    console.log('Before update: Seller', this.id);
  }

  @AfterUpdate()
  afterUpdate() {
    console.log('After update: Seller', this.id);

    if (this.is_robot) {
      console.log(`Reset job for seller ${this.id} with new interval: ${this.robot_start_time} seconds`);
      // this.robotJob.resetCronJobForSeller(this.id);
    }
  }
}
