import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class ResetPasswordDemandDto {
    @ApiProperty()

    @IsNotEmpty()
    @IsEmail()
    readonly email: string;
}