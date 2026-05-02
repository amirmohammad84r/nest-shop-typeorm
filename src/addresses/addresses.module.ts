import { Module } from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { AddressesController } from './addresses.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Addresses } from './entities/adresses';
import { AddressesRepository } from './repositories/addressRepository';

@Module({
  imports: [TypeOrmModule.forFeature([Addresses])],
  providers: [AddressesService, AddressesRepository],
  controllers: [AddressesController],
})
export class AddressesModule {}
