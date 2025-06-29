import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class RegisterEmailDto {
    @IsNotEmpty()
    @MinLength(3)
    name: string;

    @IsEmail()
    email: string;

    @MinLength(6)
    password: string;
}