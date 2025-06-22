import { UserRol } from "./create-user.dto"; 

export class UserResponseDto {
    id: number;
    name: string;
    email: string;
    role: UserRol;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    lastLoginAt: Date;
}