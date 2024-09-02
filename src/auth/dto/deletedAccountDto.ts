import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class DeletedAccountDtoDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty()

    readonly password: string;
}