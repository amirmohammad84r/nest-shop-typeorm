import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { CouponsRepository } from './repositories/couponRepository';

@Injectable()
export class CouponsService {
  constructor(private readonly couRepo: CouponsRepository) { }

  async createCoupon(createCouponDto: CreateCouponDto) {
    const { code, discountPercent, expiresAt } = createCouponDto;

    // Check if coupon code already exists
    const existingCoupon = await this.couRepo.findCouponByCode(code);

    if (existingCoupon) {
      throw new ConflictException('Coupon with this code already exists');
    }

    // Check if expiresAt is in the future
    if (new Date(expiresAt) <= new Date()) {
      throw new BadRequestException('Expiration date must be in the future');
    }

    const coupon = await this.couRepo
      .create({
        code: code,
        discountPercent: discountPercent,
        expiresAt: expiresAt,
        isActive: true,
      })
      .save();

    return {
      message: 'Coupon created successfully',
      coupon,
    };
  }

  async findAllCoupons() {
    const coupons = await this.couRepo.findAllCoupon();
    return {
      message: 'Coupons retrieved successfully',
      coupons,
      total: coupons.length,
    };
  }

  async findCouponById(id: string) {
    const coupon = await this.couRepo.findCouponById(id);
    if (!coupon) {
      throw new NotFoundException('Coupon not found');
    }
    return {
      message: 'Coupon retrieved successfully',
      coupon,
    };
  }

  async updateCoupon(id: string, updateCouponDto: CreateCouponDto) {
    // Check if coupon exists
    await this.findCouponById(id);
    // Check if code is being updated and if it's already taken
    if (updateCouponDto.code) {
      const existingCoupon = await this.couRepo.findCouponByCode(
        updateCouponDto.code,
      );
      if (existingCoupon && existingCoupon.id !== id) {
        throw new ConflictException('Coupon code already taken');
      }
    }
    const coupon = await this.couRepo.update(id, updateCouponDto);
    return {
      message: 'Coupon updated successfully',
      coupon,
    };
  }

  async deleteCoupon(id: string) {
    // Check if coupon exists
    await this.findCouponById(id);
    await this.couRepo.delete({ id });
    return {
      message: 'Coupon deleted successfully',
    };
  }

  async validateCoupon(code: string) {
    const coupon = await this.couRepo.findCouponByCode(code);
    if (!coupon) {
      throw new NotFoundException('Coupon not found');
    }
    if (!coupon.isActive) {
      throw new BadRequestException('Coupon is not active');
    }
    if (new Date(coupon.expiresAt) < new Date()) {
      throw new BadRequestException('Coupon has expired');
    }
    return {
      message: 'Coupon is valid',
      coupon: {
        id: coupon.id,
        code: coupon.code,
        discountPercent: coupon.discountPercent,
      },
    };
  }
}
