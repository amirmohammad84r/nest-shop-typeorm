import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartQuantityDto } from './dto/update-cart-quantity.dto';
import { ProductRepository } from 'src/products/repositories/productRepository';
import { CartRepository } from './repositories/cartRepository';
import { Cart_ItemsRepository } from './repositories/cartItemsRepository';

@Injectable()
export class CartService {
  constructor(
    private readonly proRepo: ProductRepository,
    private readonly cartRepo: CartRepository,
    private readonly cartItemRepo: Cart_ItemsRepository,
  ) { }

  async addItemToCart(userId: string, addItemDto: AddCartItemDto) {
    const { productId, quantity } = addItemDto;
    // Check if product exists
    const product = await this.proRepo.findProductById(productId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    if (product.stock < quantity) {
      throw new BadRequestException('Insufficient stock');
    }
    // Get or create cart for user
    let cart = await this.cartRepo.findCartByUserId(userId);
    if (!cart) {
      cart = await this.cartRepo
        .create({
          userId,
        })
        .save();
    }

    // Check if item already exists in cart
    const existingItem = await this.cartItemRepo.checkItemISInCart(
      cart.id,
      productId,
    );

    if (existingItem) {
      // Update quantity
      await this.cartItemRepo.update(
        existingItem.id,

        { quantity: existingItem.quantity + quantity },
      );
    } else {
      // Create new cart item
      await this.cartItemRepo
        .create({
          cartId: cart.id,
          productId,
          quantity,
        })
        .save();
    }
    return {
      message: 'Item added to cart successfully',
      data: existingItem,
    };
  }

  async getCartItems(userId: string) {
    const cart = await this.cartRepo.findCartByUserId(userId);
    if (!cart) {
      return {
        message: 'Cart retrieved successfully',
        cart: {
          items: [],
          totalItems: 0,
          totalPrice: 0,
        },
      };
    }
    console.log(cart);
    let totalPrice = 0;
    const items = cart.cartItems.map((item) => {
      const itemTotal = item.product.price * item.quantity;
      totalPrice += itemTotal;
      return {
        ...item,
        totalPrice: itemTotal,
      };
    });
    return {
      message: 'Cart retrieved successfully',
      cart: {
        id: cart.id,
        items,
        totalItems: items.length,
        totalPrice,
      },
    };
  }

  async updateItemQuantity(
    userId: string,
    itemId: string,
    updateQuantityDto: UpdateCartQuantityDto,
  ) {
    // Find cart item and ensure it belongs to user
    const cartItem = await this.cartItemRepo.checkItemBlongToUser(
      itemId,
      userId,
    );
    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }
    if (cartItem.product.stock < updateQuantityDto.quantity) {
      throw new BadRequestException('Insufficient stock');
    }
    const updatedItem = await this.cartItemRepo.preload({ id: itemId, quantity: updateQuantityDto.quantity })
    if (!updatedItem) throw new NotFoundException('Cart item not found');
    return {
      message: 'Cart item quantity updated successfully',

      item: {
        ...updatedItem,
        totalPrice: updatedItem.product.price * updatedItem.quantity
      },
    };
  }

  async removeItemFromCart(userId: string, itemId: string) {
    // Find cart item and ensure it belongs to user
    const cartItem = await this.cartItemRepo.checkItemBlongToUser(itemId, userId)
    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }
    await this.cartItemRepo.delete({
      id: itemId,
    });
    return {
      message: 'Item removed from cart successfully',
    };
  }

  async clearCart(userId: string) {
    const cart = await this.cartRepo.findCartByUserId(userId)
    if (!cart) {
      return {
        message: 'Cart cleared successfully',
      };
    }
    await this.cartItemRepo.delete({
      cartId: cart.id,
    });
    return {
      message: 'Cart cleared successfully',
    };
  }
  async getCartTotal(userId: string) {
    const cart = await this.getCartItems(userId);
    return {
      message: 'Cart total retrieved successfully',
      total: cart.cart.totalPrice,
      itemCount: cart.cart.totalItems,
    };
  }
}
