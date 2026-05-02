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

@Entity('coupons')
export class Coupons extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  code: string;

  @Column({ type: 'datetime' })
  expiresAt: Date;

  @Column({ type: 'float' })
  discountPercent: number;

  @Column({ type: 'boolean' })
  isActive: boolean;
}
