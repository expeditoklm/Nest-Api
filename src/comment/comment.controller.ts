import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post ,Put, Req, UseGuards} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/createCommentDto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { UpdateCommentDto } from './dto/updateCommentDto';
import { ApiTags } from '@nestjs/swagger';


@ApiTags('Commentaires')
@Controller('comment')
export class CommentController {

    constructor(private readonly commentService : CommentService) {}
    
    @Get()
    getAll() {
        return this.commentService.getAll();
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('create')  
    create(@Body() createCommentDto : CreateCommentDto , @Req() request : Request) {
        const userId =  request.user['userId']
        return this.commentService.create(createCommentDto, userId);
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete('delete/:id')
    delete(@Param('id', ParseIntPipe) commentId:number, @Req() request : Request,@Body('postId') postId : number) {
        const userId =  request.user['userId'];
        return this.commentService.delete(commentId,userId,postId); 
    }

    @UseGuards(AuthGuard('jwt'))
    @Put('update/:id')
    update(@Param('id', ParseIntPipe) commentId:number, @Req() request : Request,@Body() updateCommentDto : UpdateCommentDto) {
        const userId =  request.user['userId'];
        return this.commentService.update(commentId,userId,updateCommentDto);

    }
}
