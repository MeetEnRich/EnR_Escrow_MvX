import BigNumber from 'bignumber.js';
import { OfferSCResponseDto } from '../dto/offer-sc-response.dto';

export class offeredPayment {
  tokenIdentifier: string;
  amount: string;
  nonce: number;
  numDecimals: number;
}

export class Offer {
  offerID: number;
  creator: string;
  offeredPayment: offeredPayment;
  acceptedPayment: offeredPayment;
  acceptedAddress: string;

  static fromResponse(offerPair: [BigNumber, OfferSCResponseDto]): Offer {
    return {
      offerID: offerPair[0].toNumber(),
      creator: offerPair[1].creator.toString(),
      offeredPayment: {
        amount: offerPair[1].offered_payment.amount.toFixed(0),
        tokenIdentifier: offerPair[1].offered_payment.token_identifier,
        nonce: offerPair[1].offered_payment.token_nonce.toNumber(),
      },
      acceptedPayment: {
        amount: offerPair[1].accepted_payment.amount.toFixed(0),
        tokenIdentifier: offerPair[1].accepted_payment.token_identifier,
        nonce: offerPair[1].accepted_payment.token_nonce.toNumber(),
      },
      acceptedAddress: offerPair[1].accepted_address.toString(),
    } as Offer;
  }
}
