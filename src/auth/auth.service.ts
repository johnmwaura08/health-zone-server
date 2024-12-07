import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { sign, verify } from 'jsonwebtoken';
import { PrismaService } from 'src/prisma/prisma.service';
import { User, RefreshToken } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { LoginResponseDto } from './dto/loginresponse.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly prismService: PrismaService,
    private configService: ConfigService,
  ) {}

  // automatically called by passport as long as our request contains an email and password
  async validateUser(email: string, password: string): Promise<Partial<User>> {
    const user = await this.userService.findUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (await this.isPasswordMatching(password, user.hashedPassword)) {
      return user;
    } else {
      throw new UnauthorizedException('Invalid Credentials');
    }
  }

  async login(
    email: string,
    values: { userAgent: string; ipAddress: string },
  ): Promise<LoginResponseDto | null> {
    const user = await this.userService.findUserByEmail(email);

    return await this.getLoginResponse(values, user.id, user.email);
  }
  async forgotPassword(email: string) {
    await this.userService.forgotPassword(email);
    return true;
  }
  async changePassword(
    newPass: string,
    email: string,
    values: { userAgent: string; ipAddress: string },
  ): Promise<LoginResponseDto> {
    const password = await bcrypt.hash(newPass, 10);
    const user = await this.prismService.user.update({
      where: { email },
      data: { hashedPassword: password },
    });
    return await this.getLoginResponse(values, user.id, user.email);
  }

  /**
   *
   * @description returns a new access token if the refresh token is valid and not expired
   * @param refreshStr
   * @returns token or undefined
   */

  public async refresh(refreshStr: string): Promise<string | undefined> {
    const token = await this.retrieveRefreshToken(refreshStr);
    if (!token) {
      return;
    }
    const user = await this.prismService.user.findUnique({
      where: { id: token.userId },
    });
    if (!user) {
      return;
    }
    const accessToken = await this.signAccessToken(user.email, user.id);
    return accessToken;
  }

  public async getLoginResponse(
    values: { userAgent: string; ipAddress: string },
    userId: string,
    email: string,
  ): Promise<LoginResponseDto> {
    const tokens = await this.newRefreshAndAccessToken(userId, email, values);

    const res = new LoginResponseDto();
    res.email = email;
    res.accessToken = tokens.accessToken;
    res.refreshToken = tokens.refreshToken;
    res.id = userId;

    return res;
  }

  private async isPasswordMatching(
    plainTextPassword: string,
    hashedPassword: string,
  ) {
    return await bcrypt.compare(plainTextPassword, hashedPassword);
  }

  private async newRefreshAndAccessToken(
    userId: string,
    userEmail: string,
    values: { userAgent: string; ipAddress: string },
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const token = await this.prismService.refreshToken.create({
      data: {
        userAgent: values.userAgent,
        ipAddress: values.ipAddress,
        userId,
      },
    });
    const signedToken = await this.signRefreshToken(token);
    return {
      refreshToken: signedToken,
      accessToken: await this.signAccessToken(userEmail, userId),
    };
  }

  private async signAccessToken(
    userEmail: string,
    userId: string,
  ): Promise<string> {
    return sign(
      { userEmail, userId },
      this.configService.get('ACCESS_TOKEN_SECRET'),
      {
        expiresIn: '15m',
      },
    );
  }

  private async signRefreshToken(token: RefreshToken): Promise<string> {
    return sign({ ...token }, this.configService.get('REFRESH_TOKEN_SECRET'), {
      expiresIn: '200d',
    });
  }

  /**
   * @description retrieves a refresh token from the database if it exists and is valid and not expired
   * @param refreshStr
   * @returns refreshToken or undefined
   */

  private async retrieveRefreshToken(
    refreshStr: string,
  ): Promise<RefreshToken | undefined> {
    try {
      const payload = verify(
        refreshStr,
        this.configService.get('REFRESH_TOKEN_SECRET'),
      );
      if (typeof payload === 'string' || !payload) {
        return;
      }

      return await this.getRefreshTokenFromDb(payload.id);
    } catch (error) {
      console.error(error);
      return;
    }
  }

  private async getRefreshTokenFromDb(
    refreshTokenId: string,
  ): Promise<RefreshToken | undefined> {
    return await this.prismService.refreshToken.findUnique({
      where: { id: refreshTokenId },
    });
  }
}
