import { CreateOfferDto } from './dto/create-offer.dto';
import { EscrowConfigService } from './escrow-config/escrow-config.service';
import { Offer } from './entities/offer.entity';
export declare class OffersService {
    private readonly smartContractController;
    private readonly transactionFactory;
    private readonly escrowConfigService;
    constructor(escrowConfigService: EscrowConfigService);
    create(address: string, offer: CreateOfferDto): Promise<import("@multiversx/sdk-core/out").IPlainTransactionObject>;
    confirm(address: string, offerId: number): Promise<import("@multiversx/sdk-core/out").IPlainTransactionObject>;
    cancel(address: any, offerId: number): Promise<import("@multiversx/sdk-core/out").IPlainTransactionObject>;
    private createTransactionProps;
    created(address: string): Promise<Offer[]>;
    received(address: string): Promise<Offer[]>;
    private retrieveOffers;
}
