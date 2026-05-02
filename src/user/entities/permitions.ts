import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BaseEntity,
    ManyToMany
} from 'typeorm';
import { RolesTable } from './role';

@Entity('permitions')
export class Permitions extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    title: string;

    @ManyToMany(() => RolesTable, (o) => o.permitions)
    role: RolesTable[];
}
