import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { TaskStatus } from '../@types/task-status.enum';
import { User } from '../../user/entities/user.entity';

@Entity({ name: 'tasks' })
export class Task {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'varchar',
        length: '100',
        nullable: false,
    })
    title: string;

    @Column({
        type: 'text',
        nullable: true,
        default: null,
    })
    description: string;

    @Column({
        type: 'enum',
        enum: TaskStatus,
        nullable: false,
        default: TaskStatus.TO_DO,
    })
    status: TaskStatus;

    @CreateDateColumn({
        name: 'created_at',
        type: 'timestamp',
    })
    createdAt: Date;

    @UpdateDateColumn({
        name: 'updated_at',
        type: 'timestamp',
    })
    updatedAt: Date;

    @DeleteDateColumn({
        name: 'deleted_at',
        nullable: true,
    })
    deletedAt: Date;

    @ManyToOne(() => User, (user) => user.id)
    @JoinColumn({ name: 'created_by' })
    createdBy: User;

    @ManyToOne(() => Task, (task) => task.subtasks)
    parent: Task;

    // Eager was activated on purpose, I understand that the search becomes heavier, but I believe it makes more sense in this case.
    @OneToMany(() => Task, (task) => task.parent, { eager: true })
    subtasks: Task[];
}
