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
import { Cart_Items } from './cartItems';

@Entity('carts')
export class Carts extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  userId: string;

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.cart, { onDelete: 'CASCADE' })
  user: User;

  @OneToMany(() => Cart_Items, (o) => o.cart)
  cartItems: Cart_Items[];
}
