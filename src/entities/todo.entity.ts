import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
class Todo{
    @PrimaryGeneratedColumn()
    id:number;
    @Column()
    title:string;
    @Column({default:false})
    isCompleted:boolean;
    


}
export default Todo;