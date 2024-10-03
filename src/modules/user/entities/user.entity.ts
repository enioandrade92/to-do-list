import {
    BaseEntity,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class User extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        name: 'first_name',
        type: 'varchar',
        length: '100',
        nullable: false,
    })
    name: string;

    @Column({
        type: 'varchar',
        length: '100',
        nullable: false,
        unique: true,
    })
    email: string;

    @Column({
        type: 'varchar',
        length: '100',
        nullable: false,
    })
    password: string;

    @CreateDateColumn({
        name: 'created_at',
        type: 'timestamp',
        nullable: true,
    })
    createdAt: Date;

    @UpdateDateColumn({
        name: 'updated_at',
        type: 'timestamp',
        nullable: true,
    })
    updatedAt: Date;

    @DeleteDateColumn({
        name: 'deleted_at',
        nullable: true,
    })
    deletedAt: Date;
}
