import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCommentDto } from './dto/createCommentDto';
import { UpdateCommentDto } from './dto/updateCommentDto';

@Injectable()
export class CommentService {
    constructor( private readonly prismaService : PrismaService) {}

    async getAll() {
        return this.prismaService.comment.findMany();
    }

    
// Dans le service CommentService
async create(createCommentDto: CreateCommentDto, userId: number) {
    const { content, postId } = createCommentDto;

    // Conversion de postId en entier
    const postIdInt = Number(postId);

    // Vérification si la conversion a réussi
    if (isNaN(postIdInt)) {
        throw new BadRequestException('Invalid postId provided');
    }

    const post = await this.prismaService.post.findUnique({
        where: { postId: postIdInt },
    });

    if (!post) throw new NotFoundException('Post does not exist');

    // Utilisation de postIdInt pour créer le commentaire
    await this.prismaService.comment.create({
        data: {
            content,
            userId,
            postId: postIdInt,  // Utilisation de la variable postIdInt
        },
    });

    return { data: 'Comment created successfully' };
}

    async delete(commentId : number,userId : number,postId : number) {
        const comment = await this.prismaService.comment.findFirst({where : {  commentId : commentId } })
        if (!comment) throw new NotFoundException('Comment does not exist')
        if(comment.postId !== postId) throw new NotFoundException('You are not authorized to delete this comment')
        if(comment.userId !== userId) throw new ForbiddenException('You are not authorized to delete this comment')
        await this.prismaService.comment.delete({where : {  commentId : commentId } });

        return {data : 'Comment deleted successfully'}
    } 
    

    async update(commentId : number,userId : number, updateCommentDto : UpdateCommentDto) {
        const { content, postId } = updateCommentDto
        const comment = await this.prismaService.comment.findFirst({where : {  commentId : commentId } })
        if (!comment) throw new NotFoundException('Comment does not exist')
        if(comment.postId !== postId) throw new NotFoundException('You are not authorized to delete this comment')
        if(comment.userId !== userId) throw new ForbiddenException('You are not authorized to delete this comment')
        await this.prismaService.comment.update({where : {  commentId : commentId } ,data : {content}}); 

        return {data : 'Comment updated successfully'}
    }

}
