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
import { CartService } from './cart.service';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartQuantityDto } from './dto/update-cart-quantity.dto';

@ApiTags('cart')
@ApiBearerAuth()
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('items')
  @ApiOperation({ summary: 'Add item to cart' })
  @ApiResponse({ status: 201, description: 'Item added to cart successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async addItemToCart(@Body() addItemDto: AddCartItemDto) {
    // TODO: Get userId from JWT token in real implementation
    const userId = '4c54d7b9-9052-4f05-a791-7b0a236f925c'; // Mock for now
    return this.cartService.addItemToCart(userId, addItemDto);
  }

  @Get('items')
  @ApiOperation({ summary: 'Get all cart items' })
  @ApiResponse({ status: 200, description: 'List of cart items' })
  async getCartItems() {
    // TODO: Get userId from JWT token in real implementation
    const userId = '4c54d7b9-9052-4f05-a791-7b0a236f925c'; // Mock for now
    return this.cartService.getCartItems(userId);
  }

  @Put('items/:itemId')
  @ApiOperation({ summary: 'Update cart item quantity' })
  @ApiParam({ name: 'itemId', description: 'Cart item ID' })
  @ApiResponse({
    status: 200,
    description: 'Item quantity updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Cart item not found' })
  async updateItemQuantity(
    @Param('itemId') itemId: string,
    @Body() updateQuantityDto: UpdateCartQuantityDto,
  ) {
    // TODO: Get userId from JWT token in real implementation
    const userId = '4c54d7b9-9052-4f05-a791-7b0a236f925c'; // Mock for now
    return this.cartService.updateItemQuantity(
      userId,
      itemId,
      updateQuantityDto,
    );
  }

  @Delete('items/:itemId')
  @ApiOperation({ summary: 'Remove item from cart' })
  @ApiParam({ name: 'itemId', description: 'Cart item ID' })
  @ApiResponse({
    status: 200,
    description: 'Item removed from cart successfully',
  })
  @ApiResponse({ status: 404, description: 'Cart item not found' })
  async removeItemFromCart(@Param('itemId') itemId: string) {
    // TODO: Get userId from JWT token in real implementation
    const userId = '4c54d7b9-9052-4f05-a791-7b0a236f925c'; // Mock for now
    // return this.cartService.removeItemFromCart(userId, itemId);
  }

  @Delete('items')
  @ApiOperation({ summary: 'Clear all items from cart' })
  @ApiResponse({ status: 200, description: 'Cart cleared successfully' })
  async clearCart() {
    // TODO: Get userId from JWT token in real implementation
    const userId = '4c54d7b9-9052-4f05-a791-7b0a236f925c'; // Mock for now
    return this.cartService.clearCart(userId);
  }

  @Get('total')
  @ApiOperation({ summary: 'Get cart total price' })
  @ApiResponse({ status: 200, description: 'Cart total price' })
  async getCartTotal() {
    // TODO: Get userId from JWT token in real implementation
    const userId = '4c54d7b9-9052-4f05-a791-7b0a236f925c'; // Mock for now
    // return this.cartService.getCartTotal(userId);
  }
}
