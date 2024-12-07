import { ForbiddenException, Injectable } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { generateEmailBody } from './user.utils';
import { EmailService } from 'src/email/email.service';
import { HealthZoneUtils } from 'src/utils/health-zone-utils';

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly emailService: EmailService,
    private configService: ConfigService,
  ) {}

  async onboardAdmin() {
    const email = this.configService.get('SYSTEM_ADMIN_EMAIL');
    const name = this.configService.get('SYSTEM_ADMIN_NAME');
    const user = await this.findUserByEmail(email);
    if (user) {
      const emailBody = `Warning! Someone tried to onboard the system Admin Account.`;
      const subject =
        'Warning! Someone tried to onboard the system Admin Account!';
      await this.emailService.sendEmail(
        emailBody,
        subject,
        this.configService.get('SYSTEM_ADMIN_EMAIL'),
      );
      throw new ForbiddenException(
        'Invalid Request: You are not authorized! System Admin has been notified !! Error: Illegal Action Attempted',
      );
    }
    await this.create(name, email);

    return 'System Admin Created';
  }

  async create(name: string, email: string) {
    const user = await this.prismaService.user.create({
      data: {
        email,
        name,
        hashedPassword: '',
      },
    });

    return await this.sendPassword(user.email, user.name);
  }

  async forgotPassword(email: string) {
    const user = await this.findUserByEmail(email);
    if (!user) {
      throw new ForbiddenException('Invalid Request: Unknown User');
    }
    await this.sendPassword(user.email, user.name, true);
  }

  private async sendPassword(
    email: string,
    name: string,
    forgotPassword?: boolean,
  ) {
    const temporaryPassword = HealthZoneUtils.generatePassword();
    const hashedPassword =
      await HealthZoneUtils.hashPassword(temporaryPassword);

    await this.updateUserPassword(email, hashedPassword);
    const url = this.configService.get('FRONTEND_URL');
    const emailBody = generateEmailBody(
      name,
      temporaryPassword,
      url,
      forgotPassword,
    );
    const subject = forgotPassword
      ? 'Temporary Password'
      : 'Welcome to Health Zone';
    await this.emailService.sendEmail(emailBody, subject, email);

    return await this.findUserByEmail(email);
  }

  async findUserByEmail(email: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: email,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        hashedPassword: true,
      },
    });
    return user;
  }
  async findUserById(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return user;
  }

  async updateUserPassword(email: string, password: string) {
    const user = await this.findUserByEmail(email);
    if (!user) {
      throw new ForbiddenException('Invalid Request: Unknown User');
    }
    return await this.prismaService.user.update({
      where: {
        id: user.id,
      },
      data: {
        hashedPassword: password,
      },
    });
  }

  async getUsers() {
    return await this.prismaService.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
  async updateUser(userId: string, name: string) {
    const user = await this.findUserById(userId);
    if (!user) {
      throw new ForbiddenException('Invalid Request: Unknown User');
    }

    return await this.prismaService.user.update({
      where: {
        id: user.id,
      },
      data: {
        name: name,
      },
    });
  }

  async deleteUser(userId: string, requestEmail: string) {
    const user = await this.findUserById(userId);
    if (!user) {
      throw new ForbiddenException('Invalid Request: Unknown User');
    }
    if (user.email === this.configService.get('SYSTEM_ADMIN_EMAIL')) {
      const emailBody = `Warning! Someone tried to delete the system Admin Account. Review action taken by ${requestEmail}`;
      const subject =
        'Warning!! Someone tried to delete the system Admin Account';
      await this.emailService.sendEmail(
        emailBody,
        subject,
        this.configService.get('SYSTEM_ADMIN_EMAIL'),
      );
      throw new ForbiddenException(
        'Invalid Request: You are not authorized! System Admin has been notified !! Error: Illegal Action Attempted',
      );
    }
    await this.prismaService.user.delete({
      where: {
        id: user.id,
      },
    });
    return true;
  }
}
