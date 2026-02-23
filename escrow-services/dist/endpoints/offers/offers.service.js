"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OffersService = void 0;
const common_1 = require("@nestjs/common");
const out_1 = require("@multiversx/sdk-core/out");
const escrow_config_service_1 = require("./escrow-config/escrow-config.service");
const offer_entity_1 = require("./entities/offer.entity");
const escrowAbi = __importStar(require("../../contracts/escrow.abi.json"));
let OffersService = class OffersService {
    smartContractController;
    transactionFactory;
    escrowConfigService;
    constructor(escrowConfigService) {
        this.escrowConfigService = escrowConfigService;
        const apiNetworkProvider = new out_1.ApiNetworkProvider(escrowConfigService.getApiUrl(), { clientName: 'escrowTutorialService' });
        const abiRegistry = out_1.AbiRegistry.create(escrowAbi);
        this.smartContractController = new out_1.SmartContractController({
            chainID: escrowConfigService.getChainId(),
            networkProvider: apiNetworkProvider,
            abi: abiRegistry,
        });
        const factoryConfig = new out_1.TransactionsFactoryConfig({
            chainID: escrowConfigService.getChainId(),
        });
        this.transactionFactory = new out_1.SmartContractTransactionsFactory({
            config: factoryConfig,
            abi: abiRegistry,
        });
    }
    async create(address, offer) {
        const token = new out_1.Token({
            identifier: offer.offeredToken,
            nonce: BigInt(offer.offeredNonce),
        });
        const tokenTransfer = new out_1.TokenTransfer({
            token,
            amount: BigInt(offer.offeredAmount),
        });
        const txProps = this.createTransactionProps(address, 'createOffer', [
            offer.acceptedToken,
            offer.acceptedNonce,
            offer.acceptedAmount,
            offer.acceptedAddress,
        ]);
        const transaction = (await this.transactionFactory.createTransactionForExecute(txProps.sender, {
            contract: txProps.contract,
            gasLimit: txProps.gasLimit,
            function: txProps.function,
            arguments: txProps.arguments,
            tokenTransfers: [tokenTransfer],
        })).toPlainObject();
        return transaction;
    }
    async confirm(address, offerId) {
        const senderOffer = await this.received(address);
        const offer = senderOffer.find((offer) => offer.offerID === offerId);
        if (!offer) {
            throw new common_1.BadRequestException('Offer with provided id was not found');
        }
        const token = new out_1.Token({
            identifier: offer.acceptedPayment.tokenIdentifier,
            nonce: BigInt(offer.acceptedPayment.nonce),
        });
        const tokenTransfer = new out_1.TokenTransfer({
            token,
            amount: BigInt(offer.acceptedPayment.amount),
        });
        const txProps = this.createTransactionProps(address, 'acceptOffer', [
            offerId,
        ]);
        const transaction = (await this.transactionFactory.createTransactionForExecute(txProps.sender, {
            contract: txProps.contract,
            gasLimit: txProps.gasLimit,
            function: txProps.function,
            arguments: txProps.arguments,
            tokenTransfers: [tokenTransfer],
        })).toPlainObject();
        return transaction;
    }
    async cancel(address, offerId) {
        const txProps = this.createTransactionProps(address, 'cancelOffer', [
            offerId,
        ]);
        const transaction = (await this.transactionFactory.createTransactionForExecute(txProps.sender, {
            contract: txProps.contract,
            gasLimit: txProps.gasLimit,
            function: txProps.function,
            arguments: txProps.arguments,
        })).toPlainObject();
        return transaction;
    }
    createTransactionProps(address, functionName, args) {
        return {
            sender: out_1.Address.newFromBech32(address),
            contract: out_1.Address.newFromBech32(this.escrowConfigService.getEscrowSCAddress()),
            gasLimit: 20000000n,
            function: functionName,
            arguments: args,
        };
    }
    async created(address) {
        return await this.retrieveOffers(address, 'getCreatedOffers');
    }
    async received(address) {
        return await this.retrieveOffers(address, 'getWantedOffers');
    }
    async retrieveOffers(address, functionName) {
        try {
            const query = this.smartContractController.createQuery({
                contract: out_1.Address.newFromBech32(this.escrowConfigService.getEscrowSCAddress()),
                function: functionName,
                arguments: [out_1.Address.newFromBech32(address)],
            });
            const response = await this.smartContractController.runQuery(query);
            const parsedResponse = this.smartContractController.parseQueryResponse(response);
            if (!parsedResponse || parsedResponse.length === 0) {
                return [];
            }
            const offers = parsedResponse.map((typedValue) => {
                const pair = typedValue.valueOf();
                return offer_entity_1.Offer.fromResponse(pair);
            });
            return offers;
        }
        catch (error) {
            console.error('Error retrieving offers:', error);
            return [];
        }
    }
};
exports.OffersService = OffersService;
exports.OffersService = OffersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [escrow_config_service_1.EscrowConfigService])
], OffersService);
//# sourceMappingURL=offers.service.js.map