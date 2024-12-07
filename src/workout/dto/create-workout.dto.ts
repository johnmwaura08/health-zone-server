import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateWorkoutDto {
  @IsNotEmpty()
  workoutCategoryId: string;
  @IsNotEmpty()
  @IsNumber()
  reps: number;
  @IsNotEmpty()
  @IsNumber()
  sets: number;
  weight?: number;
  comments?: string;
}
