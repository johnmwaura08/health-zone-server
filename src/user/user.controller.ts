import {
  Controller,
  Post,
  Body,
  Get,
  Ip,
  Req,
  HttpStatus,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { HealthZoneUtils } from 'src/utils/health-zone-utils';
import { AuthService } from 'src/auth/auth.service';
import { UserResponseDto } from './dto/new-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DeleteUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { Public } from 'src/auth/skipAuth';

@ApiTags('user')
@Controller({
  path: 'user',
})
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('create')
  async create(@Body() dto: CreateUserDto) {
    const newUser = await this.userService.create(dto.name, dto.email);
    const res: UserResponseDto = {
      email: newUser.email,
      name: newUser.name,
      id: newUser.id,
      createdAt: newUser.createdAt.toISOString(),
      updatedAt: newUser.updatedAt.toISOString(),
    };
    return res;
  }
  @Get('userList')
  getUsers() {
    return this.userService.getUsers();
  }
  @Post('change-password')
  async changePassword(
    @Req() request,
    @Ip() ip: string,
    @Body() body: ChangePasswordDto,
  ) {
    const email = HealthZoneUtils.getUserEmailFromAccessToken(request);
    return await this.authService.changePassword(body.password, email, {
      ipAddress: ip,
      userAgent: request.headers['user-agent'],
    });
  }
  @Post('update')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The user has been successfully updated.',
    type: UserResponseDto,
  })
  async update(@Body() updateUserDto: UpdateUserDto) {
    const updatedUser = await this.userService.updateUser(
      updateUserDto.id,
      updateUserDto.name,
    );
    const res: UserResponseDto = {
      email: updatedUser.email,
      name: updatedUser.name,
      id: updatedUser.id,
      createdAt: updatedUser.createdAt.toISOString(),
      updatedAt: updatedUser.updatedAt.toISOString(),
    };
    return res;
  }
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The user has been successfully deleted.',
  })
  @Post('delete')
  async remove(@Body() dto: DeleteUserDto, @Request() request) {
    const requestEmail = HealthZoneUtils.getUserEmailFromAccessToken(request);

    return await this.userService.deleteUser(dto.id, requestEmail);
  }

  @Public()
  @Post('onboard')
  async onboard() {
    return this.userService.onboardAdmin();
  }
}
