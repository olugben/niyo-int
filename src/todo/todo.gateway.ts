
import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { Server } from 'socket.io';

import TodoDto, { UpdateTodoDto } from 'src/dto/todo.dto';
import { TodoService } from './todo.service';
import { UseGuards } from '@nestjs/common';
import { WsAuthGuard } from 'src/ws.guards.jwt';




@WebSocketGateway()
export class TodoGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly todoService: TodoService) {}
  @UseGuards(WsAuthGuard)
  @SubscribeMessage('createtodo')
  async handleCreateTodo(@MessageBody() todoDto: any) {
    
    try{
    const todo = await this.todoService.create(JSON.parse(todoDto));
   
    this.server.emit('todoCreated', todo);
    
    return todo}
    catch(error){
this.handleError(error)
    }
  }
  
  @SubscribeMessage('getTodos')
  async handleGetTodos() {
    try {
      const todos = await this.todoService.findAll(); 
      this.server.emit('todosRetrieved', todos);
      return todos;
    } catch (error) {
      this.handleError(error);
    }}


@UseGuards(WsAuthGuard)
  @SubscribeMessage('updatetodo')
  async handleUpdateTodo(@MessageBody() updateToDo:any ) {
    try{
      const updateToDoDto=JSON.parse(updateToDo)
    const todo= await this.todoService.update(updateToDoDto.id, updateToDoDto.isCompleted, updateToDoDto.title);
    
    this.server.emit('todoUpdated', todo);
    
    return {"message":"updated successfully"}
    }
    catch(error){
      return this.handleError(error)
    }
  }
  @UseGuards(WsAuthGuard)
  @SubscribeMessage('deletetodo')
  async handleDeleteTodo(@MessageBody() id: any) {
    await this.todoService.delete(id);
    this.server.emit('todoDeleted', { id });
    return "deleted";
  }
  private handleError(error: any) {
    console.error('WebSocket error:', error.message);

    this.server.emit('error', { message: error.message });
  }
}
