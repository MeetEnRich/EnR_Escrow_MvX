import { Address } from '@multiversx/sdk-core/out';
import BigNumber from 'bignumber.js';

export type OfferSCResponseDto = {
  creator: Address;
  offered_payment: {
    amount: BigNumber;
    token_identifier: string;
    token_nonce: BigNumber;
  };
  accepted_payment: {
    amount: BigNumber;
    token_identifier: string;
    token_nonce: BigNumber;
  };
  accepted_address: Address;
};
