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
import { OrderItems } from './orderItems';
import { Payments } from 'src/payments/entities/payment';

@Entity('orders')
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'text', default: 'PENDING' })
  status: string;

  @Column({ type: 'float', default: 0 })
  totalPrice: number;

  // Relations
  @ManyToOne(() => User, (user) => user.order, { onDelete: 'CASCADE' })
  user: User;

  @OneToMany(() => OrderItems, (item) => item.order)
  orderItems: OrderItems[];

  @OneToMany(() => Payments, payment => payment.order, { nullable: true })
  payment: Payments[];
}
