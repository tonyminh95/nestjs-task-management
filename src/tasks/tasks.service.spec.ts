import { Test } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TaskRepository } from './task.repository';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { NotFoundException } from '@nestjs/common';

const mockTaskRepository = () => ({
    getTasks: jest.fn(),
    findOne: jest.fn(),
    createTask: jest.fn(),
    delete: jest.fn()
});

const mockUser = { id: 1, username: 'Test' };

describe('TasksService', () => {
    let taskService;
    let taskRepository;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                TasksService,
                { provide: TaskRepository, useFactory: mockTaskRepository }
            ]
        }).compile();

        taskService = await module.get<TasksService>(TasksService);
        taskRepository = await module.get<TaskRepository>(TaskRepository);
    });

    describe('getTasks', () => {
        it('gets all tasks from the repository', async () => {
            taskRepository.getTasks.mockResolvedValue('someValue');

            expect(taskRepository.getTasks).not.toHaveBeenCalled();

            const getTasksFilterDto: GetTasksFilterDto = { status: TaskStatus.OPEN, search: 'Some search query' };

             const result = await taskRepository.getTasks(getTasksFilterDto, mockUser);

            expect(result).toEqual('someValue');
        })
    });

    describe('getTaskById', () => {
        it('calls taskRepository.findOne() and successfully retreive and return the task', async () => {
            const mockTask = { title: 'Test task', description: 'Test desc' };

            taskRepository.findOne.mockResolvedValue(mockTask);

            const result = await taskService.getTaskById(1, mockUser);

            expect(result).toEqual(mockTask);

            expect(taskRepository.findOne).toHaveBeenCalledWith({
                where: {
                    id: 1,
                    userId: mockUser.id
                }
            });
        });

        it('throws an error as task is not found', () => {
            taskRepository.findOne.mockResolvedValue(null);

            expect(taskService.getTaskById(1, mockUser)).rejects.toThrow(NotFoundException);
            // expect(taskRepository.getTaskById(1, mockUser)).rejects.not.toThrow();
        });
    });

    describe('createTask', () => {
        it('calls taskRepository.create() and returns the result', async () => {
            taskRepository.createTask.mockResolvedValue('someTask');

            expect(taskRepository.createTask).not.toHaveBeenCalled();

            const createTaskDto = { title: 'Test task', description: 'Test desc' };

            const result = await  taskService.createTask(createTaskDto, mockUser);

            expect(taskRepository.createTask).toHaveBeenCalledWith(createTaskDto, mockUser);

            expect(result).toEqual('someTask');
        });
    });

    describe('deleteTask', () => {
        it('calls taskRepository.deleteTask() to delete a task', async () => {
            taskRepository.delete.mockResolvedValue({ affected: 1 });

            expect(taskRepository.delete).not.toHaveBeenCalled();

            await taskService.deleteTask(1, mockUser);

            expect(taskRepository.delete).toHaveBeenCalledWith({ id: 1, userId: mockUser.id });
        });

        it('throws an error as task could not be found', () => {
            taskRepository.delete.mockResolvedValue({ affected: 0 });

            expect(taskService.deleteTask(1, mockUser)).rejects.toThrow(NotFoundException);
        })
    });

    describe('updateTaskStatus', () => {
        it('updates a task status', async () => {
            const save = jest.fn().mockResolvedValue(true);

            taskService.getTaskById = jest.fn().mockResolvedValue({
                status: TaskStatus.OPEN,
                save
            });

            expect(taskService.getTaskById).not.toHaveBeenCalled();

            expect(save).not.toHaveBeenCalled();

            const result = await taskService.updateTaskStatus(1, TaskStatus.DONE, mockUser);

            expect(taskService.getTaskById).toHaveBeenCalled();

            expect(save).toHaveBeenCalled();

            expect(result.status).toEqual(TaskStatus.DONE);
        });
    });
});
