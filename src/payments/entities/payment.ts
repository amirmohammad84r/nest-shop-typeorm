import { Carts } from 'src/cart/entities/cart';
import { Comments } from 'src/comments/entities/comment';
import { Order } from 'src/orders/entities/orders';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  OneToMany,
  ManyToMany
} from 'typeorm';
@Entity('payments')
export class Payments extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  orderId: string;

  @Column({type:'float'})
  amount: number;

  @Column({default:'PENDING'})
  status: string;

  @Column({nullable:true})
  transactionId: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToMany(() => Order, (user) => user.payment, { onDelete: 'CASCADE' })
    order: Order;
}