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
  JoinColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  ManyToOne,
} from 'typeorm';
import { RolesTable } from './role';
import { Logs } from 'src/logs/entities/logTable';

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column()
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => RolesTable, (a) => a.user)
  role: RolesTable;

  @OneToMany(() => Order, (o) => o.user)
  order: Order[];

  @OneToMany(() => Comments, (o) => o.user)
  comment: Comments[];

  @OneToMany(() => Carts, (o) => o.user)
  cart: Carts[];

  @OneToMany(() => Logs, (o) => o.user)
  logs: Logs[];
}
