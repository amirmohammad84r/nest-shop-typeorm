import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@ApiTags('comments')
@ApiBearerAuth()
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new comment' })
  @ApiResponse({ status: 201, description: 'Comment created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async createComment(@Body() createCommentDto: CreateCommentDto) {
    // TODO: Get userId from JWT token in real implementation
    const userId = 'cmlos1a5j0001gf0supojdw1l'; // Mock for now
    return this.commentsService.createComment(userId, createCommentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all comments' })
  @ApiResponse({ status: 200, description: 'List of comments' })
  async findAllComments() {
    return this.commentsService.findAllComments();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get comment by ID' })
  @ApiParam({ name: 'id', description: 'Comment ID' })
  @ApiResponse({ status: 200, description: 'Comment found' })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  async findCommentById(@Param('id') id: string) {
    return this.commentsService.findCommentById(id);
  }

  @Get('product/:productId')
  @ApiOperation({ summary: 'Get comments by product ID' })
  @ApiParam({ name: 'productId', description: 'Product ID' })
  @ApiResponse({ status: 200, description: 'List of product comments' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async findCommentsByProduct(@Param('productId') productId: string) {
    return this.commentsService.findCommentsByProduct(productId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update comment by ID' })
  @ApiParam({ name: 'id', description: 'Comment ID' })
  @ApiResponse({ status: 200, description: 'Comment updated successfully' })
  @ApiResponse({
    status: 404,
    description: 'Comment not found or access denied',
  })
  async updateComment(
    @Param('id') id: string,
    @Body() updateCommentDto: CreateCommentDto,
  ) {
    // TODO: Get userId from JWT token in real implementation
    const userId = 'cmlos1a5j0001gf0supojdw1l'; // Mock for now
    return this.commentsService.updateComment(id, userId, updateCommentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete comment by ID' })
  @ApiParam({ name: 'id', description: 'Comment ID' })
  @ApiResponse({ status: 200, description: 'Comment deleted successfully' })
  @ApiResponse({
    status: 404,
    description: 'Comment not found or access denied',
  })
  async deleteComment(@Param('id') id: string) {
    // TODO: Get userId from JWT token in real implementation
    const userId = 'cmlos1a5j0001gf0supojdw1l'; // Mock for now
    return this.commentsService.deleteComment(id, userId);
  }

  @Get('product/:productId/stats')
  @ApiOperation({ summary: 'Get product comments statistics' })
  @ApiParam({ name: 'productId', description: 'Product ID' })
  @ApiResponse({ status: 200, description: 'Product comments statistics' })
  async getProductCommentsStats(@Param('productId') productId: string) {
    return this.commentsService.getProductCommentsStats(productId);
  }
}
