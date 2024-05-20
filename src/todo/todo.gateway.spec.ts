import { Test, TestingModule } from '@nestjs/testing';
import { TodoGateway } from './todo.gateway';
import { TodoService } from './todo.service';
import { WsAuthGuard } from '../ws.guards.jwt';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

// Mock AuthGuard for testing
@Injectable()
class MockWsAuthGuard {
  canActivate(context: ExecutionContext): boolean {
    return true;
  }
}

describe('TodoGateway', () => {
  let todoGateway: TodoGateway;
  let todoService: TodoService;

  const mockTodoService = {
    create: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockServer = {
    emit: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoGateway,
        { provide: TodoService, useValue: mockTodoService },
      ],
    })
      .overrideGuard(WsAuthGuard)
      .useValue(new MockWsAuthGuard())
      .compile();

    todoGateway = module.get<TodoGateway>(TodoGateway);
    todoService = module.get<TodoService>(TodoService);

    // Mock WebSocket server
    (todoGateway as any).server = mockServer;
  });

  it('should be defined', () => {
    expect(todoGateway).toBeDefined();
  });

  describe('handleCreateTodo', () => {
    it('should create a todo and emit the event', async () => {
      const todoDto = JSON.stringify({ title: 'Sleep', isCompleted: false });
      const createdTodo = { id: 1, title: 'Sleep', isCompleted: false };
      mockTodoService.create.mockResolvedValue(createdTodo);

      const result = await todoGateway.handleCreateTodo(todoDto);

      expect(result).toEqual(createdTodo);
      expect(mockTodoService.create).toHaveBeenCalledWith(JSON.parse(todoDto));
      expect(mockServer.emit).toHaveBeenCalledWith('todoCreated', createdTodo);
    });

    it('should handle errors', async () => {
      const error = new Error('Failed to create todo');
      mockTodoService.create.mockRejectedValue(error);

      const todoDto = JSON.stringify({ title: 'Sleep', isCompleted: false });

      await todoGateway.handleCreateTodo(todoDto);

      expect(mockServer.emit).toHaveBeenCalledWith('error', { message: error.message });
    });
  });

  describe('handleGetTodos', () => {
    it('should retrieve todos and emit the event', async () => {
      const todos = [{ id: 1, title: 'Sleep', isCompleted: false }];
      mockTodoService.findAll.mockResolvedValue(todos);

      const result = await todoGateway.handleGetTodos();

      expect(result).toEqual(todos);
      expect(mockTodoService.findAll).toHaveBeenCalled();
      expect(mockServer.emit).toHaveBeenCalledWith('todosRetrieved', todos);
    });

    it('should handle errors', async () => {
      const error = new Error('Failed to fetch todos');
      mockTodoService.findAll.mockRejectedValue(error);

      await todoGateway.handleGetTodos();

      expect(mockServer.emit).toHaveBeenCalledWith('error', { message: error.message });
    });
  });

  describe('handleUpdateTodo', () => {
    it('should update a todo and emit the event', async () => {
      const updateToDoDto = JSON.stringify({ id: 1, isCompleted: true, title: 'Sleep more' });
      const updatedTodo = { id: 1, isCompleted: true, title: 'Sleep more' };
      mockTodoService.update.mockResolvedValue(updatedTodo);

      const result = await todoGateway.handleUpdateTodo(updateToDoDto);

      expect(result).toEqual({ message: 'updated successfully' });
      expect(mockTodoService.update).toHaveBeenCalledWith(1, true, 'Sleep more');
      expect(mockServer.emit).toHaveBeenCalledWith('todoUpdated', updatedTodo);
    });

    it('should handle errors', async () => {
      const error = new Error('Failed to update todo');
      mockTodoService.update.mockRejectedValue(error);

      const updateToDoDto = JSON.stringify({ id: 1, isCompleted: true, title: 'Sleep more' });

      await todoGateway.handleUpdateTodo(updateToDoDto);

      expect(mockServer.emit).toHaveBeenCalledWith('error', { message: error.message });
    });
  });


});
