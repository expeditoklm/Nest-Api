import { ApiProperty } from "@nestjs/swagger";
import {IsNotEmpty } from "class-validator";

export class UpdatePostDto{
    @IsNotEmpty()
    @ApiProperty()
    readonly title?: string;
    @IsNotEmpty()
    @ApiProperty()
    readonly body?: string;
    
}