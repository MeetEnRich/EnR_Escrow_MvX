import BigNumber from 'bignumber.js';
import { OfferSCResponseDto } from '../dto/offer-sc-response.dto';
export declare class offeredPayment {
    tokenIdentifier: string;
    amount: string;
    nonce: number;
    numDecimals: number;
}
export declare class Offer {
    offerID: number;
    creator: string;
    offeredPayment: offeredPayment;
    acceptedPayment: offeredPayment;
    acceptedAddress: string;
    static fromResponse(offerPair: [BigNumber, OfferSCResponseDto]): Offer;
}
