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
import { Product } from 'src/products/entities/product';
// import { OrderItem } from 'src/order-items/entities/order-item';
// import { Payment } from 'src/payments/entities/payment';

@Entity('comments')
export class Comments extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  productId: string;

  @Column()
  userId: string;

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @Column({ type: 'int' })
  rating: number;

  @Column()
  comment: string;

  // Relations
  @ManyToOne(() => User, (user) => user.comment, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Product, (product) => product.comment, {
    onDelete: 'CASCADE',
  })
  product: Product;
}