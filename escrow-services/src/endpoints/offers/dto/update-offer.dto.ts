import { ApiProperty } from '@nestjs/swagger';

export class UpdateOfferDto {
  @ApiProperty({ example: 1, description: 'ID of the offer to update' })
  offerId: number;
}
