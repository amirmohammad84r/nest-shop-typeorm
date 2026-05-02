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

@Entity('addresses')
export class Addresses extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column({ nullable: true })
  phone: string;

  @Column()
  city: string;

  @Column()
  street: string;

  @Column()
  postalCode: string;

  // Relations
  @ManyToOne(() => User, (user) => user.order, { onDelete: 'CASCADE' })
  user: User;
}
