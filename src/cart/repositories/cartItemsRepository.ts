import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Carts } from '../entities/cart';
import { Cart_Items } from '../entities/cartItems';

@Injectable()
export class Cart_ItemsRepository extends Repository<Cart_Items> {
  constructor(private dataSource: DataSource) {
    super(Cart_Items, dataSource.createEntityManager());
  }
  async checkItemISInCart(cartId: string, productId: string) {
    return this.findOne({
      where: {
        cartId,
        productId,
      },
    });
  }
  async checkItemBlongToUser(itemId: string, userId: string) {
    return this.findOne({
      where: {
        id: itemId,
        cart: { id: userId },
      },
    });
  }
}
