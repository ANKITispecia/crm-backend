// auth-service/src/auth/dto/create-user.dto.ts
export class CreateUserDto {
    name: string;
    email: string;
    password: string;
    roleCode: string; // Role code for role-based signup
  }
  