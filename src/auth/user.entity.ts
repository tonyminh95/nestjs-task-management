import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Task } from '../tasks/task.entity';
import { type } from 'os';

@Entity()
@Unique([ 'username' ])
export class User extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    password: string;

    @Column()
    salt: string;

    @OneToMany(type => Task, task => task.user, { eager: true })
    tasks: Task[];

    async validatePassword(password: string): Promise<boolean> {
        return this.password === await bcrypt.hash(password, this.salt);
    }

}
