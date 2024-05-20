import { Test, TestingModule } from '@nestjs/testing';
import { TodoService } from './todo.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Todo from '../entities/todo.entity';
import TodoDto from '../dto/todo.dto';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';

describe('TodoService', () => {
  let todoService: TodoService;
  let todoRepository: Repository<Todo>;

  const mockTodoRepository = {
    find: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  };

  const mockTodo: Todo = {
    id: 1,
    title: 'Test Todo',
    isCompleted: false,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoService,
        {
          provide: getRepositoryToken(Todo),
          useValue: mockTodoRepository,
        },
      ],
    }).compile();

    todoService = module.get<TodoService>(TodoService);
    todoRepository = module.get<Repository<Todo>>(getRepositoryToken(Todo));
  });

  it('should be defined', () => {
    expect(todoService).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of todos', async () => {
      mockTodoRepository.find.mockResolvedValue([mockTodo]);

      const result = await todoService.findAll();

      expect(result).toEqual([mockTodo]);
      expect(todoRepository.find).toHaveBeenCalled();
    });

    it('should throw an InternalServerErrorException if find fails', async () => {
      mockTodoRepository.find.mockRejectedValue(new Error('Error fetching todos'));

      await expect(todoService.findAll()).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('create', () => {
    it('should create a new todo', async () => {
      const todoDto: any = { title: 'Test Todo', isCompleted: false };
      const createdTodo: Todo = { ...todoDto, id: 1, isCompleted: false };

      mockTodoRepository.save.mockResolvedValue(createdTodo);

      const result = await todoService.create(todoDto);

      expect(result).toEqual(createdTodo);
      expect(todoRepository.save).toHaveBeenCalledWith(expect.objectContaining(todoDto));
    });

    it('should throw an InternalServerErrorException if create fails', async () => {
      const todoDto: any = { title: 'Test Todo', isCompleted: false };

      mockTodoRepository.save.mockRejectedValue(new Error('Error creating todo'));

      await expect(todoService.create(todoDto)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('update', () => {
    it('should update an existing todo', async () => {
      const updatedTodo: Todo = { id: 1, title: 'Updated Todo', isCompleted: true };

      mockTodoRepository.findOne.mockResolvedValue(mockTodo);
      mockTodoRepository.save.mockResolvedValue(updatedTodo);

      const result = await todoService.update(1, true, 'Updated Todo');

      expect(result).toEqual(updatedTodo);
      expect(todoRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(todoRepository.save).toHaveBeenCalledWith(expect.objectContaining(updatedTodo));
    });

   

   
  });


});
