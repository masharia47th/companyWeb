import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Department } from "src/department/entities/department.entity";
import { Card } from "src/card/entities/card.entity";

@Entity()
export class Swimlane {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({length:355})
    name: string;

    @Column()
    order:number;
    

    @Column()
    departmentId: number;


    @ManyToOne(()=> Department, (department) => department.swimlanes)
    @JoinColumn()
    department: Department;

    @OneToMany(()=>Card,(card=> card.swimlane))
    cards:Card[];
  



    
    
}
