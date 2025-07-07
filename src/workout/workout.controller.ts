import {
  Controller,
  Request,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { WorkoutService } from './workout.service';
import { CreateWorkoutDto } from './dto/create-workout.dto';
import { UpdateWorkoutDto } from './dto/update-workout.dto';
import { ApiTags } from '@nestjs/swagger';
import { HealthZoneUtils } from 'src/utils/health-zone-utils';
import { Public } from 'src/auth/skipAuth';

@Controller('workout')
@ApiTags('workout')
export class WorkoutController {
  constructor(private readonly workoutService: WorkoutService) {}

  @Public()
  @Post()
  create(@Request() request, @Body() createWorkoutDto: CreateWorkoutDto) {
    const userId = HealthZoneUtils.getUserIdFromAccessToken(request);

    return this.workoutService.create(createWorkoutDto, userId);
  }

  @Public()
  @Get()
  async findAll(@Request() request) {
    const userId = HealthZoneUtils.getUserIdFromAccessToken(request);

    return await this.workoutService.findAll(userId);
  }

  @Patch(':id')
  async update(
    @Request() request,
    @Param('id') id: string,
    @Body() updateWorkoutDto: UpdateWorkoutDto,
  ) {
    const userId = HealthZoneUtils.getUserIdFromAccessToken(request);

    return await this.workoutService.update(id, updateWorkoutDto, userId);
  }

  @Delete(':id')
  async remove(@Request() request, @Param('id') id: string) {
    const userId = HealthZoneUtils.getUserIdFromAccessToken(request);

    return await this.workoutService.remove(id, userId);
  }
}
