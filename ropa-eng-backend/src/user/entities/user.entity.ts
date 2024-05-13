import { BeforeInsert, Column, Entity, JoinColumn, ManyToMany, JoinTable, PrimaryGeneratedColumn, OneToOne, OneToMany } from "typeorm";
import * as bcrypt from 'bcrypt';
import { Department } from "src/department/entities/department.entity";
import { Card } from "src/card/entities/card.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({length:355})
    firstName: string;
    
    @Column({length:355})
    secondName: string;
    
    @Column({length:355})
    email: string;

    @Column()


    @Column ()
    password:string;    

    @Column({default:false})
    emailVerified: boolean;
    
    @ManyToMany(()=> Department, (department) => department.users)
    @JoinTable()
    department: Department[];

    @OneToMany(()=> Card, (user) => user.assigne)
    @JoinTable()
    card:Card[];
    
    @BeforeInsert()
    async hashPassword(){
        if(this.password) {
            this.password = await bcrypt.hash(this.password, 10)
        }
    }
}
