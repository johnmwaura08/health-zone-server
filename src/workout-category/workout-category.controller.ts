import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
} from '@nestjs/common';
import { WorkoutCategoryService } from './workout-category.service';
import { CreateWorkoutCategoryDto } from './dto/create-workout-category.dto';
import { UpdateWorkoutCategoryDto } from './dto/update-workout-category.dto';
import { ApiTags } from '@nestjs/swagger';
import { HealthZoneUtils } from 'src/utils/health-zone-utils';
import { Public } from 'src/auth/skipAuth';

@Controller('workout-category')
@ApiTags('workout-category')
export class WorkoutCategoryController {
  constructor(
    private readonly workoutCategoryService: WorkoutCategoryService,
  ) {}

  @Public()
  @Post()
  async create(
    @Request() request,
    @Body() createWorkoutCategoryDto: CreateWorkoutCategoryDto,
  ) {
    const userId = HealthZoneUtils.getUserIdFromAccessToken(request);
    console.log({ userId, request });
    return await this.workoutCategoryService.create(
      createWorkoutCategoryDto.name,
      createWorkoutCategoryDto.type,
      userId,
    );
  }

  @Public()
  @Get()
  async findAll(@Request() request) {
    const userId = HealthZoneUtils.getUserIdFromAccessToken(request);

    return await this.workoutCategoryService.findAll(userId);
  }

  @Patch(':id')
  async update(
    @Request() request,
    @Param('id') id: string,
    @Body() updateWorkoutCategoryDto: UpdateWorkoutCategoryDto,
  ) {
    const userId = HealthZoneUtils.getUserIdFromAccessToken(request);

    return await this.workoutCategoryService.update(
      id,
      updateWorkoutCategoryDto.name,
      updateWorkoutCategoryDto.type,
      userId,
    );
  }

  @Delete(':id')
  async remove(@Request() request, @Param('id') id: string) {
    const userId = HealthZoneUtils.getUserIdFromAccessToken(request);

    return await this.workoutCategoryService.remove(id, userId);
  }
}
