import { Body, Controller, Delete, Get, InternalServerErrorException, NotFoundException, Param, Post, Put, UseGuards } from '@nestjs/common';
import { TodoService } from './todo.service';
import { AuthGuard } from '../auth.guard';
import TodoDto, { UpdateTodoDto } from '../dto/todo.dto';


@Controller('todo')
export class TodoController {


  constructor(private readonly todoService: TodoService) { }




  @Get("all")
  @UseGuards(AuthGuard)
  async findAll(): Promise<TodoDto[]> {
    try {
      const todos = await this.todoService.findAll();
      return todos;
    } catch (error) {
      // log error

      throw new InternalServerErrorException('Failed to fetch todos.');
    }
  }

  @Post("new")
  @UseGuards(AuthGuard)
  create(@Body() tododto: TodoDto) {
    return this.todoService.create(tododto)
  }

  @UseGuards(AuthGuard)
  @Put(":id")
  update(@Param('id') id: number, @Body() updatetododto: UpdateTodoDto) {
    return this.todoService.update(id, updatetododto.isCompleted, updatetododto.title)
  }


  @UseGuards(AuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<{ message: string }> {
    try {
      await this.todoService.delete(id);
      return { message: `Todo with  id ${id}  deleted successfully.` };
    } catch (error) {

      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else {
        throw new InternalServerErrorException('Failed to delete todo.');
      }
    }
  }

}
