import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "src/user/entities/user.entity";
import { Swimlane } from "src/swimlane/entities/swimlane.entity";

@Entity()
export class Card {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({length:355})
    name: string;

    @Column()
    description:string;

    @Column()
    order:number;

    @Column()
    assigneId: number;

    @ManyToOne(()=> User, (user) => user.card)
    @JoinColumn()
    assigne:User;

    @Column()
    swimlaneId: number;
    
    @ManyToOne(()=>Swimlane,(swimlane)=> swimlane.cards)
    @JoinColumn()
    swimlane: Swimlane;


 
}


