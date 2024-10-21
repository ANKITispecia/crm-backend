import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module'; // Import your auth module
import { User } from './auth/entities/user.entity'; // Import the User entity
import { Otp } from './auth/entities/user.otp';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'mysql', // This refers to the MySQL container in Docker Compose
      port: 3306,
      username: 'root',
      password: 'rootpassword',
      database: 'crm_db',
      entities: [User, Otp], // Add all the entities used by your services
      synchronize: true, // This auto-syncs your entities with the DB schema (for dev only)
    }),
    AuthModule, // Register your AuthModule
  ],
})
export class AppModule {}
