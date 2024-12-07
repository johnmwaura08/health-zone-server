import { Module } from '@nestjs/common';
import { WorkoutCategoryService } from './workout-category.service';
import { WorkoutCategoryController } from './workout-category.controller';

@Module({
  controllers: [WorkoutCategoryController],
  providers: [WorkoutCategoryService],
})
export class WorkoutCategoryModule {}
