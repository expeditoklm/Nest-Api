import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class SignUpDto {
    @ApiProperty()

    @IsNotEmpty()
    readonly userName: string;
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty()

    readonly email: string;
    @IsNotEmpty()
    @ApiProperty()

    readonly password: string;
}