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
} from 'typeorm';
import { Permitions } from './permitions';
import { User } from './user';
export enum roles {
    USER = 'user',
    ADMIN = 'admin',
    MANAGER = 'manager',
    WAREHOUSE = 'warehouse',
}

@Entity('role')
export class RolesTable extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'text', default: roles.USER })
    type: roles;

    @Column({ unique: true, type: 'text' })
    title: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => User, (o) => o.role)
    user: User[];

    @ManyToMany(() => Permitions, (o) => o.role)
    @JoinTable()
    permitions: Permitions[];
}
