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
import { Carts } from './cart';
import { Product } from 'src/products/entities/product';

@Entity('cart_items')
export class Cart_Items extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  cartId: string;

  @Column({ unique: true })
  productId: string;

  @Column({ type: 'int', default: 1 })
  quantity: number;

  // Relations
  @ManyToOne(() => Carts, (user) => user.cartItems, { onDelete: 'CASCADE' })
  cart: User;

  @ManyToOne(() => Product, (o) => o.cartItems, {
    onDelete: 'CASCADE',
    eager: true,
  })
  product: Product;
}
