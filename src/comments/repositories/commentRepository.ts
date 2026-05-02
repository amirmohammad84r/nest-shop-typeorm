import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Comments } from '../entities/comment';

@Injectable()
export class CommentsRepository extends Repository<Comments> {
  constructor(private dataSource: DataSource) {
    super(Comments, dataSource.createEntityManager());
  }
  async findAllComments() {
    return this.find();
  }
  async findCommentById(id: string) {
    return this.findOneBy({ id });
  }
  async findCommentsByProduct(id: string) {
    return this.find({ where: { productId: id } });
  }
  async checkCommentBelongToUser(id: string, userId: string) {
    return this.find({
      where: {
        id,
        userId,
      },
    });
  }
}
