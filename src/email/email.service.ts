import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private transporter;

  constructor(private configService: ConfigService) {
    const host = this.configService.get('EMAIL_HOST');
    const port = this.configService.get('EMAIL_PORT');
    const user = this.configService.get('EMAIL_SENDER');
    const pass = this.configService.get('EMAIL_PASSWORD');

    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      host,
      port: parseInt(port, 10),
      //  secure: false,
      secure: true, // use SSL
      auth: {
        user,
        pass,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  async sendEmail(body: string, subject: string, recipient: string) {
    const mailOptions = {
      from: this.configService.get('EMAIL_SENDER'),
      to: recipient,
      subject,
      html: body,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      throw new Error(`Error sending email: ${error.message}`);
    }
  }
}
