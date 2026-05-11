import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  BaseEntity,
  CreateDateColumn,
} from 'typeorm';

@Entity('coupons')
export class Coupons extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  code: string;

  @Column()
  expiresAt: Date;

  @Column({ type: 'float' })
  discountPercent: number;

  @Column({ type: 'boolean' })
  isActive: boolean;
}
