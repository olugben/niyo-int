import { Test, TestingModule } from '@nestjs/testing';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import TodoDto from "../dto/todo.dto";
import UpdateTodoDto from "../dto/todo.dto"
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext, Injectable } from '@nestjs/common';

// Mock AuthGuard for testing
@Injectable()
class MockAuthGuard {
  canActivate(context: ExecutionContext): boolean {
    return true;
  }
}

describe('TodoController', () => {
  let todocontroller: TodoController;
  let todoService: TodoService;

  const mockTodoService = {
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockJwtService = {};
  const mockUserService = {};

  const mockTodoDto: any= {
    title: 'Sleep',
    isCompleted: false,
  };

  const mockUpdateTodoDto: any = {
    title: 'Sleep more',
    isCompleted: true,
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [TodoController],
      providers: [
        { provide: TodoService, useValue: mockTodoService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: UsersService, useValue: mockUserService },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue(new MockAuthGuard())
      .compile();

    todocontroller = moduleRef.get<TodoController>(TodoController);
    todoService = moduleRef.get<TodoService>(TodoService);
  });

  it('should be defined', () => {
    expect(todocontroller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of todos', async () => {
      mockTodoService.findAll.mockResolvedValue([mockTodoDto]);

      const result = await todocontroller.findAll();

      expect(result).toEqual([mockTodoDto]);
      expect(todoService.findAll).toHaveBeenCalled();
    });

    it('should throw an InternalServerErrorException if findAll fails', async () => {
      mockTodoService.findAll.mockRejectedValue(new Error('Error fetching todos'));

      await expect(todocontroller.findAll()).rejects.toThrow(InternalServerErrorException);
      expect(todoService.findAll).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create a new todo', async () => {
      mockTodoService.create.mockResolvedValue(mockTodoDto);

      const result = await todocontroller.create(mockTodoDto);

      expect(result).toEqual(mockTodoDto);
      expect(todoService.create).toHaveBeenCalledWith(mockTodoDto);
    });

    
  });

  describe('update', () => {
    it('should update an existing todo', async () => {
      mockTodoService.update.mockResolvedValue(mockUpdateTodoDto);

      const result = await todocontroller.update(1, mockUpdateTodoDto);

      expect(result).toEqual(mockUpdateTodoDto);
      expect(todoService.update).toHaveBeenCalledWith(1, mockUpdateTodoDto.isCompleted, mockUpdateTodoDto.title);
    });

   
  });

  


    describe('delete', () => {
      it('should delete a todo and return a success message', async () => {
        mockTodoService.delete.mockResolvedValue(undefined);
  
        const result = await todocontroller.delete(1);
  
        expect(result).toEqual({ message: `Todo with  id 1  deleted successfully.` });
        expect(todoService.delete).toHaveBeenCalledWith(1);
      });

   
  });
});


