import {
  Body,
  Controller,
  HttpStatus,
  Ip,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import {
  ApiBadRequestResponse,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/loginresponse.dto';
import RefreshTokenDto from './dto/refresh-token.dto';
import { Public } from './skipAuth';

@ApiTags('auth')
@Controller({
  path: 'auth',
})
/**
 * Auth routes will be public since they are used to generate/refresh tokens
 */
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns info for the authenticated user.',
    type: LoginResponseDto,
    isArray: true,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized Request' })
  @Public()
  @Post('login')
  async login(@Req() request, @Ip() ip: string, @Body() body: LoginDto) {
    return this.authService.login(body.email, {
      ipAddress: ip,
      userAgent: request.headers['user-agent'],
    });
  }

  @ApiUnauthorizedResponse({ description: 'Unauthorized Request' })
  @Public()
  @Post('forgot-password')
  async forgotPassword(@Body() body: ForgotPasswordDto) {
    return this.authService.forgotPassword(body.email);
  }

  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The user has been successfully created.',
    type: LoginResponseDto,
    isArray: true,
  })
  @ApiBadRequestResponse({ description: 'Unauthorized Access' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: String,
  })
  @Public()
  @Post('refresh')
  async refresh(@Body() body: RefreshTokenDto) {
    const res = await this.authService.refresh(body.refreshToken);
    if (!res) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    return res;
  }
}
