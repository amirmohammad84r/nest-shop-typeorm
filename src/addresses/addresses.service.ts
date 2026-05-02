import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { AddressesRepository } from './repositories/addressRepository';

@Injectable()
export class AddressesService {
  constructor(private readonly addressRepo: AddressesRepository) { }

  async createAddress(userId: string, createAddressDto: CreateAddressDto) {
    const address = await this.addressRepo
      .create({
        city: createAddressDto.city,
        phone: createAddressDto.phone,
        street: createAddressDto.street,
        userId: userId,
        postalCode: createAddressDto.postalCode,
      })
      .save();

    return {
      message: 'Address created successfully',
      address,
    };
  }

  async findAllAddresses(userId: string) {
    const addresses = await this.addressRepo.findAllAddresses();
    return {
      message: 'Addresses retrieved successfully',
      addresses,
      total: addresses.length,
    };
  }

  async findAddressById(id: string, userId: string) {
    const address = await this.addressRepo.findAddressById(id, userId);
    if (!address) {
      throw new NotFoundException('Address not found');
    }
    return {
      message: 'Address retrieved successfully',
      address,
    };
  }

  async updateAddress(
    id: string,
    userId: string,
    updateAddressDto: CreateAddressDto,
  ) {
    // Check if address exists and belongs to user
    await this.findAddressById(id, userId);
    const address = await this.addressRepo.update(id, updateAddressDto);
    return {
      message: 'Address updated successfully',
      address,
    };
  }

  async deleteAddress(id: string, userId: string) {
    // Check if address exists and belongs to user
    await this.findAddressById(id, userId);
    await this.addressRepo.delete({ id });
    return {
      message: 'Address deleted successfully',
    };
  }
}
