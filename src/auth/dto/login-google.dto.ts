import { IsNotEmpty, IsString } from "class-validator";

export class LoginGoogleDto {
    @IsNotEmpty()
    @IsString()
    idToken: string;
}