import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v1 as uuidv1 } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {

    private tasks: Task[] = [];

    getAllTasks(): Task[] {
        return this.tasks;
    }

    getTasksWithFilters({ status, search }: GetTasksFilterDto): Task[] {
        let tasks = this.getAllTasks();

        if (status) {
            tasks = tasks.filter(task => task.status === status);
        }

        if (search) {
            tasks = tasks.filter(task =>
                task.title.includes(search) || task.description.includes(search)
            )
        }

        return tasks;
    }

    getTaskById(id: string): Task {
        const task = this.tasks.find(task => task.id === id);

        if (!task) {
            throw new NotFoundException(`Task with ID "${id}" not found`);
        }

        return task;
    }

    createTask({ title, description }: CreateTaskDto): Task {
        const task: Task = {
            id: uuidv1(),
            title,
            description,
            status: TaskStatus.OPEN
        };

        this.tasks.push(task);

        return task;
    }

    updateTaskStatus(id: string, status: TaskStatus): Task {
        const task = this.getTaskById(id);
        task.status = status

        return task;
    }

    deleteTask(id: string): void {
        const task = this.getTaskById(id);

        if (!task) {
            throw new NotFoundException(`Task with ID "${id}" not found`);
        }

        this.tasks = this.tasks.filter(task => task.id !== task.id);
    }

}
