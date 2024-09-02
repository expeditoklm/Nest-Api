import { ApiProperty } from "@nestjs/swagger";
import {IsNotEmpty } from "class-validator";

export class CreateCommentDto{
    @IsNotEmpty()
    @ApiProperty()

    readonly content: string;

    @IsNotEmpty()
    @ApiProperty()

    readonly postId: number;
}