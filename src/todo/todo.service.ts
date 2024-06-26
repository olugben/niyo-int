import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import TodoDto from "../dto/todo.dto"
import Todo from "../entities/todo.entity"
import { Repository } from 'typeorm';


@Injectable()
export class TodoService {
    constructor(@InjectRepository(Todo) private todoRepository: Repository<Todo>){}


    async findAll(): Promise<any> {
        try {
          const todos = await this.todoRepository.find();
          return todos;
        } catch (error) {
         
          throw new InternalServerErrorException('Failed to fetch todos.');
        }
      }
      async create(todos: TodoDto): Promise<Todo> {
        try {
          const todo = new Todo();
          
        
          todo.title = todos.title; 
          todo.isCompleted = false; 

          const createdTodo = await this.todoRepository.save(todo);
          

          return createdTodo;
        } catch (error) {
          // console.error('Error creating todo:', error);
          throw new InternalServerErrorException('Failed to create todo.');
        }
      }

    async update(id:any, isCompleted:boolean,title:string){
        const todo =await this.todoRepository.findOne({where:{id:id}})
        if (todo){
          
           todo.isCompleted =isCompleted;
           todo.title=title;
          
           return this.todoRepository.save(todo) 
         
        }
       
       return null;
      }

    delete(id:number){
        return this.todoRepository.delete(id)
       }
}
