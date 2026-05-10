import { Cart_Items } from 'src/cart/entities/cartItems';
import { Category } from 'src/categories/entities/category';
import { Comments } from 'src/comments/entities/comment';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

@Entity('products')
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('float')
  price: number;

  @Column()
  stock: number = 0;

  @CreateDateColumn()
  createdAt: Date;

  @Column('text', { array: true })
  imgs: string[];

  @ManyToOne(() => Category, (C) => C.product, { nullable: true })
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @OneToMany(() => Comments, (o) => o.user)
  comment: Comments[];

  @OneToMany(() => Cart_Items, (o) => o.product)
  cartItems: Cart_Items[];
}
