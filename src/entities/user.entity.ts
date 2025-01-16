import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import {Document} from './document.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    fullName: string;

    @Column({unique: true})
    email: string;

    @Column()
    password: string;

    @Column({default: 'Regular User'})
    role: 'Regular User' | 'Admin';

    @OneToMany(()=> Document, doc =>doc.owner )
        documents: Document[];
}