import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { NativeAuthGuard, NativeAuth } from '@multiversx/sdk-nestjs-auth';

@Controller('offers')
@ApiBearerAuth()
@UseGuards(NativeAuthGuard)
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post('/create')
  create(
    @Body() offer: CreateOfferDto,
    @NativeAuth('address') address: string,
  ) {
    return this.offersService.create(address, offer);
  }

  @Post('/confirm')
  confirm(
    @Body() { offerId }: UpdateOfferDto,
    @NativeAuth('address') address: string,
  ) {
    return this.offersService.confirm(address, offerId);
  }

  @Post('/cancel')
  cancel(
    @Body() { offerId }: UpdateOfferDto,
    @NativeAuth('address') address: string,
  ) {
    return this.offersService.cancel(address, offerId);
  }

  @Get('/created')
  created(@NativeAuth('address') address: string) {
    return this.offersService.created(address);
  }

  @Get('/received')
  received(@NativeAuth('address') address: string) {
    return this.offersService.received(address);
  }
}
