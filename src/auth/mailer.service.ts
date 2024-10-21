// auth-service/src/auth/mailer.service.ts
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER || 'arordhruv109@gmail.com', // Use your email
      pass: process.env.GMAIL_PASS || 'mkwd lmhk vbsx gjfz', // Use your email password
    },
  });

  async sendOtpEmail(to: string, otp: string) {
    try {
      await this.transporter.sendMail({
        from: process.env.GMAIL_USER,
        to,
        subject: 'Your OTP Code',
        text: `Your OTP code is ${otp}`,
      });
    } catch (error) {
      throw new Error(`Failed to send OTP email ${error}`);
    }
  }
  
}
