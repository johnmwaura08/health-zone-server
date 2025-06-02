import { Injectable } from '@nestjs/common';
import { CreateWorkoutDto } from './dto/create-workout.dto';
import { UpdateWorkoutDto } from './dto/update-workout.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class WorkoutService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(request: CreateWorkoutDto, userId: string) {
    // const weightInLbs = request.weight ?parseInt(request.weight)
    return await this.prismaService.workout.create({
      data: {
        weightInLbs: Number(request.weight) || 0,
        reps: Number(request.reps) || 0,
        sets: Number(request.sets) || 0,
        workoutCategoryId: request.workoutCategoryId,
        comments: request.comments,
        userId: userId,
      },
    });
  }

  async findAll(userId: string) {
    return await this.prismaService.workout.findMany({
      where: {
        userId,
      },
      select: {
        id: true,
        weightInLbs: true,
        reps: true,
        sets: true,
        workoutCategoryId: true,
        comments: true,
        createdAt: true,
        updatedAt: true,
        category: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string, userId: string) {
    return await this.prismaService.workout.findUnique({
      where: {
        id,
        userId,
      },
    });
  }

  async update(id: string, request: UpdateWorkoutDto, userId: string) {
    return await this.prismaService.workout.update({
      where: { id, userId },
      data: {
        weightInLbs: request.weight,
        reps: request.reps,
        sets: request.sets,
        workoutCategoryId: request.workoutCategoryId,
        comments: request.comments,
      },
    });
  }

  async remove(id: string, userId: string) {
    return await this.prismaService.workout.delete({
      where: { id, userId },
    });
  }
}
