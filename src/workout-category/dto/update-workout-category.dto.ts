import { PartialType } from '@nestjs/swagger';
import { CreateWorkoutCategoryDto } from './create-workout-category.dto';

export class UpdateWorkoutCategoryDto extends PartialType(
  CreateWorkoutCategoryDto,
) {}
