import { User } from 'src/user/entities/user';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BaseEntity,
    ManyToOne,
    CreateDateColumn
} from 'typeorm';

@Entity('logs')
export class Logs extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    ip: string;

    @Column()
    type: string;

    @Column()
    discription: string;

    @Column({ nullable: true })
    userAgent: string;

    @Column({ nullable: true })
    duration: string;

    @Column()
    Module: string;

    @CreateDateColumn()
    createdAt: Date;

    @Column({ type: 'json', nullable: true })
    updatedFields?: any;

    @ManyToOne(() => User, (user) => user.logs, { onDelete: 'CASCADE' })
    user: User;
}
