// auth-service/src/auth/entities/user.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Otp } from './user.otp';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  role: string; // Example: 'admin', 'sales', 'customer'

  @OneToMany(() => Otp, (otp) => otp.user)
  otps: Otp[]; // Relationship with Otp entity
}
