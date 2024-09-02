import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class SignInDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    readonly email: string;
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    readonly password: string;
}