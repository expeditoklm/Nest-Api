import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req, UseGuards } from '@nestjs/common';
import { PostService } from './post.service';
import { use } from 'passport';
import { AuthGuard } from '@nestjs/passport';
import { CreatePostDto } from './dto/createPostDto';
import { UpdatePostDto } from './dto/updatePostDto';
import { Request } from 'express';
import { ApiTags } from '@nestjs/swagger';


@ApiTags('Publications')
@Controller('post')
export class PostController {
    constructor (private readonly postService : PostService) {}
    @UseGuards(AuthGuard('jwt'))
    @Post('create')
    create(@Body() createPostDto : CreatePostDto ,@Req() request : Request) {
        const userId =  request.user['userId'];
        return this.postService.create(createPostDto,userId);
    }

    @Get()
    getAll() {
        return this.postService.getAll();
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete('delete/:id')
    delete(@Param("id",ParseIntPipe)  postId : number ,@Req() request : Request) {
        const userId =  request.user['userId'];
        return this.postService.delete(postId,userId);
    }

    @UseGuards(AuthGuard('jwt'))
    @Put('update/:id')
    update(@Param("id",ParseIntPipe)  postId : number ,@Body()  UpdatePostDto : UpdatePostDto,@Req() request : Request) {
        const userId =  request.user['userId'];
        return this.postService.update(postId,userId,UpdatePostDto);
    }
}
