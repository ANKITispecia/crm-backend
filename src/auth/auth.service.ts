// auth-service/src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Otp } from './entities/user.otp';

import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { MailerService } from './mailer.service'; // Nodemailer logic
const bcrypt = require('bcryptjs');


@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Otp) private otpRepository: Repository<Otp>,
    private jwtService: JwtService,
    private mailerService: MailerService // Service for sending emails
  ) {}

  // Helper: Generate OTP
  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
  }

  // Helper: Get role based on role code (e.g. 12345 for admin)
  private getRoleFromCode(roleCode: string): string {
    switch (roleCode) {
      case '12345':
        return 'admin';
      case '54321':
        return 'sales';
      case '34567':
        return 'development';
      default:
        return 'customer';
    }
  }

  // Signup logic
  async signup(createUserDto: CreateUserDto) {
    try {
      const { email, password, roleCode } = createUserDto;
      const userExists = await this.userRepository.findOne({ where: { email } });
      
      if (userExists) {
        throw new UnauthorizedException('User already exists');
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const role = this.getRoleFromCode(roleCode);
  
      const user = this.userRepository.create({ email, password: hashedPassword, role });
      await this.userRepository.save(user);
  
      const otp = this.generateOtp();
      const otpEntity = this.otpRepository.create({
        user,
        otp,
        expiresAt: new Date(Date.now() + 3600000), // 1 hour
      });
      await this.otpRepository.save(otpEntity);
  
      await this.mailerService.sendOtpEmail(user.email, otp);
  
      return { message: 'OTP sent to your email. Please verify.' };
    } catch (error) {
      throw new UnauthorizedException(error.message || 'An error occurred during signup');
    }
  }
  

  // OTP verification
  async verifyOtp(verifyOtpDto: VerifyOtpDto) {
    const { email, otp } = verifyOtpDto;
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) throw new UnauthorizedException('User not found');

    const otpEntity = await this.otpRepository.findOne({
      where: { user: { id: user.id }, otp, isUsed: false },
    });

    if (!otpEntity) throw new UnauthorizedException('Invalid OTP');
    if (otpEntity.expiresAt < new Date()) throw new UnauthorizedException('OTP expired');

    // Mark OTP as used
    otpEntity.isUsed = true;
    await this.otpRepository.save(otpEntity);

    // Generate and return JWT token
    const token = this.jwtService.sign({ id: user.id, role: user.role });
    return { token };
  }

  // Login logic
  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.jwtService.sign({ id: user.id, role: user.role });
    return { token };
  }
}
