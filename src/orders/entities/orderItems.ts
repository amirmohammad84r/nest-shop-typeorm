import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  BaseEntity,
  CreateDateColumn,
} from 'typeorm';
import { User } from 'src/user/entities/user';
import { Order } from './orders';

@Entity('order_items')
export class OrderItems extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  orderId: string;

  @Column()
  productId: string;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'float' })
  priceAtPurchase: number;

  @ManyToOne(() => Order, (item) => item.orderItems)
  order: OrderItems;

  //   @OneToMany(() => Payment, payment => payment.order, { nullable: true })
  //   payment: Payment[];
}

