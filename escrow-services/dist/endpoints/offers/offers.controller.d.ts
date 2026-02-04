import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
export declare class OffersController {
    private readonly offersService;
    constructor(offersService: OffersService);
    create(offer: CreateOfferDto, address: string): Promise<import("@multiversx/sdk-core/out").IPlainTransactionObject>;
    confirm({ offerId }: UpdateOfferDto, address: string): Promise<import("@multiversx/sdk-core/out").IPlainTransactionObject>;
    cancel({ offerId }: UpdateOfferDto, address: string): Promise<import("@multiversx/sdk-core/out").IPlainTransactionObject>;
    created(address: string): Promise<import("./entities/offer.entity").Offer[]>;
    received(address: string): Promise<import("./entities/offer.entity").Offer[]>;
}
