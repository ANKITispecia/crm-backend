// auth-service/src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from './entities/user.entity';
import { Otp } from './entities/user.otp';
import { JwtModule } from '@nestjs/jwt';
import { MailerService } from './mailer.service'; // Import MailerService

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Otp]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || '1b6f3a427f27b3ee1a27134065d3298084dbcbf1872794b5c5137103a2ac77c8',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, MailerService], // Add MailerService here
})
export class AuthModule {}
