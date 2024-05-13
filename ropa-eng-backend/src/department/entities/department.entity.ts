import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "src/user/entities/user.entity";
import { Swimlane } from "src/swimlane/entities/swimlane.entity";

@Entity()
export class Department {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({length:355})
    name: string;

    @ManyToMany(()=> User, (user) => user.department)
    users: User[];

    
    @OneToMany(()=> Swimlane , (department) => department.department)
    swimlanes: Swimlane[];
    
}


