import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { OrderRepository } from 'src/orders/repositories/orderRepository';
import { PaymentRepository } from './repositories/paymentRepo';

@Injectable()
export class PaymentsService {
  constructor(private readonly orderRepo: OrderRepository, private readonly payRepo: PaymentRepository) { }

  async createPayment(orderId: string, amount: number, transactionId?: string) {
    // Check if order exists
    const order = await this.orderRepo.findOrderByOrderId(orderId);

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Check if payment already exists for this order
    const existingPayment = await this.payRepo.findPaymentByOrderId(orderId)

    if (existingPayment) {
      throw new ConflictException('Payment already exists for this order');
    }

    // Validate amount matches order total
    if (amount !== order.totalPrice) {
      throw new BadRequestException('Payment amount does not match order total');
    }
    console.log(orderId)
    console.log(amount)
    console.log(transactionId)

    const payment = await this.payRepo.create({
      orderId,
      amount,
      transactionId,

    }).save();

    return {
      message: 'Payment created successfully',
      payment,
    };
  }

  async findAllPayments() {
    const payments = await this.payRepo.findAllPays();

    return {
      message: 'Payments retrieved successfully',
      payments,
      total: payments.length,
    };
  }

  async findPaymentById(id: string) {
    const payment = await this.payRepo.findPayById(id);

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return {
      message: 'Payment retrieved successfully',
      payment,
    };
  }

  async updatePayment(id: string, status: string, transactionId?: string) {
    // Check if payment exists
    await this.findPaymentById(id);

    const payment = await this.payRepo.update(id, { status, transactionId });

    return {
      message: 'Payment updated successfully',
      payment,
    };
  }

  async deletePayment(id: string) {
    // Check if payment exists
    await this.findPaymentById(id);

    await this.payRepo.delete(id);

    return {
      message: 'Payment deleted successfully',
    };
  }
}
