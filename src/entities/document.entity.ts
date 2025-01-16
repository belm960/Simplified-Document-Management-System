import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Document {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({length: 255})
    title: string;

    @Column('text')
    content: string;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(()=> User, user =>user.documents )
    owner: User;

    @UpdateDateColumn()
    updatedAt: Date;
}