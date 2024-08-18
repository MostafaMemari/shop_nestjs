import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export class BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}

// import { BeforeInsert, BeforeUpdate, Column, PrimaryGeneratedColumn } from 'typeorm';

// export class BaseEntity {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
//   createdAt: Date;

//   @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
//   updatedAt: Date;

//   @BeforeInsert()
//   setCreatedAt() {
//     this.createdAt = new Date();
//   }

//   @BeforeUpdate()
//   setUpdatedAt() {
//     this.updatedAt = new Date();
//   }
// }
