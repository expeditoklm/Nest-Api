import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class ResetPasswordConfirmationDto {
    
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty()

    readonly email: string;
    @IsNotEmpty()
    @ApiProperty()

    readonly password: string;
    @IsNotEmpty()
    @ApiProperty()

    readonly code: string;
}