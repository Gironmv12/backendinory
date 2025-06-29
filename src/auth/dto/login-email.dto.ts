import { IsEmail, IsNotEmpty } from "class-validator";

export class LoginEmailDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    password: string;
}