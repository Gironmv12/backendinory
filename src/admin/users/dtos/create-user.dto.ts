import {IsEmail, IsEnum, IsString, IsOptional, IsBoolean, IsInt, IsNotEmpty} from "class-validator";

export enum UserRol {
    USER = 'USER',
    ADMIN = 'ADMIN'
}

export class CreateUserDto {
    @IsNotEmpty()
    name: string

    @IsEmail()
    @IsNotEmpty()
    email: string

    @IsEnum(UserRol)
    role: UserRol

    @IsBoolean()
    @IsOptional()
    isActive?: boolean

}