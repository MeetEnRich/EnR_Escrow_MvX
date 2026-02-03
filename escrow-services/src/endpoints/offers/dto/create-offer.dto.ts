import { ApiProperty } from '@nestjs/swagger';

export class CreateOfferDto {
  @ApiProperty({ example: 'WEGLD-bd4d79', description: 'Token identifier of the offered token' })
  offeredToken: string;

  @ApiProperty({ example: 0, description: 'Nonce of the offered token (0 for fungible tokens)' })
  offeredNonce: number;

  @ApiProperty({ example: '1000000000000000000', description: 'Amount of offered token in smallest units' })
  offeredAmount: string;

  @ApiProperty({ example: 'USDC-c76f1f', description: 'Token identifier of the accepted token' })
  acceptedToken: string;

  @ApiProperty({ example: '100000000000000000', description: 'Amount of accepted token in smallest units' })
  acceptedAmount: string;

  @ApiProperty({ example: 'erd1...', description: 'Address that can accept this offer' })
  acceptedAddress: string;

  @ApiProperty({ example: 0, description: 'Nonce of the accepted token (0 for fungible tokens)' })
  acceptedNonce: number;
}
