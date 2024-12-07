import { CategoryType } from '@prisma/client';
import { IsNotEmpty } from 'class-validator';

export class CreateWorkoutCategoryDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  type: CategoryType;
}
