import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/createPostDto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdatePostDto } from './dto/updatePostDto';

@Injectable()
export class PostService { 
    constructor (private readonly prismaService : PrismaService) {}

    async create(createPostDto : CreatePostDto,userId : number) {
        const { title, body } = createPostDto
        const user = await this.prismaService.user.findUnique({ where : { userId : userId } })
        if (!user) throw new Error('User does not exist')
        await this.prismaService.post.create({ data : { title, body, userId } })
        return { data : 'Post created successfully'} 
    }

    async getAll() {
        return this.prismaService.post.findMany(
            {
                include : {
                    user : {
                        select : {
                            userName : true,
                            email : true,
                            password : false
                        }
                    } ,
                    comments : {
                        include : {
                            user : {
                                select : {
                                    userName : true,
                                    email : true,
                                    password : false
                                }
                            }
                        }
                    }
       
                }  
            }
        )
             
    }

    async delete(postId : number,userId : number) {
        const post = await this.prismaService.post.findUnique({ where : { postId : postId } })
        if (!post) throw new NotFoundException('User does not exist')
        if(post.userId !== userId) throw new ForbiddenException('You are not authorized to delete this post')
        await this.prismaService.post.delete({ where : { postId : postId } })
        return { data : 'Post deleted successfully'} 
    }

    async update (postId : number,userId : number,UpdatePostDto : UpdatePostDto) {
        const post = await this.prismaService.post.findUnique({ where : { postId : postId } })
        if (!post) throw new ForbiddenException('User does not exist')
        if(post.userId !== userId) throw new ForbiddenException('You are not authorized to delete this post')
        await this.prismaService.post.update({ where : { postId : postId } , data : UpdatePostDto })
        return { data : 'Post updated successfully'} 
    }
}
