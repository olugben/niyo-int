import { IsNotEmpty, IsBoolean } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
class TodoDto {
    id: string;
    @IsNotEmpty()
    title: string;
   
    isCompleted:boolean  
  }
  export default TodoDto

  export class UpdateTodoDto extends PartialType(TodoDto) {}