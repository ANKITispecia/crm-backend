// auth-service/src/auth/entities/user.otp.ts
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Otp {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.otps)
  user: User;

  @Column()
  otp: string;

  @Column()
  expiresAt: Date;

  @Column({ default: false })
  isUsed: boolean;
}
