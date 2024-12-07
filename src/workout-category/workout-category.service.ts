import { Injectable } from '@nestjs/common';
import { CategoryType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class WorkoutCategoryService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(name: string, type: CategoryType, userId: string) {
    return await this.prismaService.workoutCategory.create({
      data: {
        name,
        type,
        userId,
      },
    });
  }

  async findAll(userId: string) {
    return await this.prismaService.workoutCategory.findMany({
      where: {
        userId,
      },
      select: {
        id: true,
        name: true,
        type: true,
      },
    });
  }

  async update(id: string, name: string, type: CategoryType, userId: string) {
    return await this.prismaService.workoutCategory.update({
      where: { id, userId },
      data: {
        name,
        type,
      },
    });
  }

  async remove(id: string, userId: string) {
    //  validate if workout category exists

    const workoutCategory = await this.prismaService.workoutCategory.findUnique(
      {
        where: { id, userId },
      },
    );
    if (!workoutCategory) {
      throw new Error('Workout category not found');
    }

    //  delete workouts that are associated with the category
    await this.prismaService.workout.deleteMany({
      where: {
        workoutCategoryId: id,
      },
    });
    return await this.prismaService.workoutCategory.delete({
      where: { id },
    });
  }
}
