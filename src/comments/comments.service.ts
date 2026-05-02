import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comments } from './entities/comment';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/products/entities/product';
import { CommentsRepository } from './repositories/commentRepository';
import { ProductRepository } from 'src/products/repositories/productRepository';

@Injectable()
export class CommentsService {
  constructor(
    private readonly comRepo: CommentsRepository,
    private readonly proRepo: ProductRepository,
  ) { }

  async createComment(userId: string, createCommentDto: CreateCommentDto) {
    // Check if product exists
    const product = await this.proRepo.findProductById(
      createCommentDto.productId,
    );

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const comment = await this.comRepo
      .create({
        ...createCommentDto,
        userId,
      })
      .save();

    return {
      message: 'Comment created successfully',
      comment,
    };
  }

  async findAllComments() {
    const comments = await this.comRepo.findAllComments();
    return {
      message: 'Comments retrieved successfully',
      comments,
      total: comments.length,
    };
  }

  async findCommentById(id: string) {
    const comment = await this.comRepo.findCommentById(id);
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    return {
      message: 'Comment retrieved successfully',
      comment,
    };
  }

  async findCommentsByProduct(productId: string) {
    // Check if product exists
    const product = await this.proRepo.findProductById(productId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    const comments = await this.comRepo.findCommentsByProduct(productId);
    // Calculate average rating
    const totalRating = comments.reduce(
      (sum, comment) => sum + comment.rating,
      0,
    );
    const averageRating =
      comments.length > 0 ? totalRating / comments.length : 0;
    return {
      message: 'Product comments retrieved successfully',
      product: {
        id: product.id,
        title: product.title,
      },
      comments,
      total: comments.length,
      averageRating: Math.round(averageRating * 10) / 10,
    };
  }

  async updateComment(
    id: string,
    userId: string,
    updateCommentDto: CreateCommentDto,
  ) {
    // Check if comment exists and belongs to user
    const comment = await this.comRepo.checkCommentBelongToUser(id, userId);
    if (!comment) {
      throw new NotFoundException('Comment not found or access denied');
    }
    const updatedComment = await this.comRepo.update(id, updateCommentDto);
    return {
      message: 'Comment updated successfully',
      comment: updatedComment,
    };
  }

  async deleteComment(id: string, userId: string) {
    // Check if comment exists and belongs to user
    const comment = await this.comRepo.checkCommentBelongToUser(id, userId);
    if (!comment) {
      throw new NotFoundException('Comment not found or access denied');
    }
    await this.comRepo.delete({
      id,
    });
    return {
      message: 'Comment deleted successfully',
    };
  }

  async getProductCommentsStats(productId: string) {
    const comments = await this.comRepo.findCommentsByProduct(productId);
    if (comments.length === 0) {
      return {
        message: 'Product comments statistics retrieved successfully',
        stats: {
          totalComments: 0,
          averageRating: 0,
          ratingDistribution: {
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0,
          },
        },
      };
    }
    const totalRating = comments.reduce(
      (sum, comment) => sum + comment.rating,
      0,
    );
    const averageRating = totalRating / comments.length;
    const ratingDistribution = {
      1: comments.filter((c) => c.rating === 1).length,
      2: comments.filter((c) => c.rating === 2).length,
      3: comments.filter((c) => c.rating === 3).length,
      4: comments.filter((c) => c.rating === 4).length,
      5: comments.filter((c) => c.rating === 5).length,
    };
    return {
      message: 'Product comments statistics retrieved successfully',
      stats: {
        totalComments: comments.length,
        averageRating: Math.round(averageRating * 10) / 10,
        ratingDistribution,
      },
    };
  }
}
