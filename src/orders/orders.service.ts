import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { ProductRepository } from 'src/products/repositories/productRepository';
import { OrderRepository } from './repositories/orderRepository';
import { DataSource } from 'typeorm';
import { Order } from './entities/orders';
import { OrderItems } from './entities/orderItems';
import { Product } from 'src/products/entities/product';

@Injectable()
export class OrdersService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly productRepository: ProductRepository,
    private readonly orderRepository: OrderRepository,
  ) { }

  async createOrder(userId: string, createOrderDto: CreateOrderDto) {
    const { items } = createOrderDto;

    if (!items || items.length === 0) {
      throw new BadRequestException('Order must contain at least one item');
    }

    // Calculate total price and validate products
    let totalPrice = 0;
    const orderItemsDto: Array<{
      productId: string;
      quantity: number;
      priceAtPurchase: number;
    }> = [];

    for (const item of items) {
      const product = await this.productRepository.findProductById(
        item.productId,
      );

      if (!product) {
        throw new NotFoundException(`Product ${item.productId} not found`);
      }

      if (product.stock < item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for product ${product.title}`,
        );
      }

      totalPrice += product.price * item.quantity;
      orderItemsDto.push({
        productId: item.productId,
        quantity: item.quantity,
        priceAtPurchase: product.price,
      });
    }

    return await this.dataSource.transaction(async (manager) => {
      const order = manager.create(Order, {
        user: { id: userId },
        totalPrice,
      });

      const savedOrder = await manager.save(order);

      const orderItems = orderItemsDto.map((item) =>
        manager.create(OrderItems, {
          order: savedOrder,
          productId: item.productId,
          quantity: item.quantity,
          priceAtPurchase: item.priceAtPurchase,
        }),
      );

      await manager.save(orderItems);

      const orderResault = await this.orderRepository.findOrderByIdAndRelation(
        savedOrder.id,
        'orderItems',
      );

      for (const item of orderItems) {
        await manager.decrement(
          Product,
          { id: item.productId },
          'stock',
          item.quantity,
        );
      }

      return {
        message: 'Order created successfully',
        orderResault,
      };
    });
  }

  async findAllOrders(status?: string, userId?: string) {
    const where: any = {};
    if (status) {
      where.status = status;
    }
    if (userId) {
      where.userId = userId;
    }
    const orders = await this.orderRepository.findAllOrders(status, userId);
    return {
      message: 'Orders retrieved successfully',
      orders,
      total: orders.length,
    };
  }

  async findOrderById(id: string) {
    const order = await this.orderRepository.findOrderById(id);

    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return {
      message: 'Order retrieved successfully',
      order,
    };
  }

  async findOrdersByUser(userId: string) {
    return this.findAllOrders(undefined, userId);
  }

  async updateOrderStatus(
    id: string,
    updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    // Check if order exists
    const order = await this.findOrderById(id);
    // Prevent status update if order is cancelled
    if (order.order.status === 'CANCELLED') {
      throw new BadRequestException('Cannot update status of cancelled order');
    }
    const updatedOrder = await this.orderRepository.update(
      id,
      updateOrderStatusDto,
    );
    return {
      message: 'Order status updated successfully',
      order: updatedOrder,
    };
  }

  async cancelOrder(id: string) {
    const order = await this.findOrderById(id);
    // Check if order can be cancelled
    if (order.order.status === 'CANCELLED') {
      throw new BadRequestException('Order is already cancelled');
    }
    if (order.order.status === 'DELIVERED') {
      throw new BadRequestException('Cannot cancel delivered order');
    }

    // Cancel order and restore stock in transaction
    return await this.dataSource.transaction(async (manager) => {
      // Update order status
      await manager.update(Order, id, { status: 'CANCELLED' });

      console.log(order.order);
      // Restore product stock
      for (const item of order.order.orderItems) {
        await manager.increment(
          Product,
          { id: item.productId },

          'stock',
          item.quantity,
        );
      }
      return {
        message: 'Order cancelled successfully',
      };
    });
  }
}
