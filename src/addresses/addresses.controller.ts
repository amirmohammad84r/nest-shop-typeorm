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
import { AddressesService } from './addresses.service';
import { CreateAddressDto } from './dto/create-address.dto';

@ApiTags('addresses')
@ApiBearerAuth()
@Controller('addresses')
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new address' })
  @ApiResponse({ status: 201, description: 'Address created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async createAddress(@Body() createAddressDto: CreateAddressDto) {
    // TODO: Get userId from JWT token in real implementation
    const userId = 'cmlos1a5j0001gf0supojdw1l'; // Mock for now
    return this.addressesService.createAddress(userId, createAddressDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all user addresses' })
  @ApiResponse({ status: 200, description: 'List of addresses' })
  async findAllAddresses() {
    // TODO: Get userId from JWT token in real implementation
    const userId = 'cmlos1a5j0001gf0supojdw1l'; // Mock for now
    return this.addressesService.findAllAddresses(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get address by ID' })
  @ApiParam({ name: 'id', description: 'Address ID' })
  @ApiResponse({ status: 200, description: 'Address found' })
  @ApiResponse({ status: 404, description: 'Address not found' })
  async findAddressById(@Param('id') id: string) {
    // TODO: Get userId from JWT token in real implementation
    const userId = 'cmlos1a5j0001gf0supojdw1l'; // Mock for now
    return this.addressesService.findAddressById(id, userId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update address by ID' })
  @ApiParam({ name: 'id', description: 'Address ID' })
  @ApiResponse({ status: 200, description: 'Address updated successfully' })
  @ApiResponse({ status: 404, description: 'Address not found' })
  async updateAddress(
    @Param('id') id: string,
    @Body() updateAddressDto: CreateAddressDto,
  ) {
    // TODO: Get userId from JWT token in real implementation
    const userId = 'cmlos1a5j0001gf0supojdw1l'; // Mock for now
    return this.addressesService.updateAddress(id, userId, updateAddressDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete address by ID' })
  @ApiParam({ name: 'id', description: 'Address ID' })
  @ApiResponse({ status: 200, description: 'Address deleted successfully' })
  @ApiResponse({ status: 404, description: 'Address not found' })
  async deleteAddress(@Param('id') id: string) {
    // TODO: Get userId from JWT token in real implementation
    const userId = 'cmlos1a5j0001gf0supojdw1l'; // Mock for now
    return this.addressesService.deleteAddress(id, userId);
  }
}
