import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import {
  AbiRegistry,
  SmartContractController,
  SmartContractTransactionsFactory,
  TransactionsFactoryConfig,
  ApiNetworkProvider,
  Address,
  Token,
  TokenTransfer,
} from '@multiversx/sdk-core/out';
import { EscrowConfigService } from './escrow-config/escrow-config.service';
import { Offer } from './entities/offer.entity';
import { OfferSCResponseDto } from './dto/offer-sc-response.dto';
import BigNumber from 'bignumber.js';

import * as escrowAbi from '../../contracts/escrow.abi.json';

@Injectable()
export class OffersService {
  private readonly smartContractController: SmartContractController;
  private readonly transactionFactory: SmartContractTransactionsFactory;
  private readonly escrowConfigService: EscrowConfigService;

  constructor(escrowConfigService: EscrowConfigService) {
    this.escrowConfigService = escrowConfigService;
    const apiNetworkProvider = new ApiNetworkProvider(
      escrowConfigService.getApiUrl(),
      { clientName: 'escrowTutorialService' },
    );

    const abiRegistry = AbiRegistry.create(escrowAbi);

    this.smartContractController = new SmartContractController({
      chainID: escrowConfigService.getChainId(),
      networkProvider: apiNetworkProvider,
      abi: abiRegistry,
    });

    const factoryConfig = new TransactionsFactoryConfig({
      chainID: escrowConfigService.getChainId(),
    });

    this.transactionFactory = new SmartContractTransactionsFactory({
      config: factoryConfig,
      abi: abiRegistry,
    });
  }

  async create(address: string, offer: CreateOfferDto) {
    const token = new Token({
      identifier: offer.offeredToken,
      nonce: BigInt(offer.offeredNonce),
    });

    const tokenTransfer = new TokenTransfer({
      token,
      amount: BigInt(offer.offeredAmount),
    });

    const txProps = this.createTransactionProps(address, 'createOffer', [
      offer.acceptedToken,
      offer.acceptedNonce,
      offer.acceptedAmount,
      offer.acceptedAddress,
    ]);

    const transaction = (
      await this.transactionFactory.createTransactionForExecute(
        txProps.sender,
        {
          contract: txProps.contract,
          gasLimit: txProps.gasLimit,
          function: txProps.function,
          arguments: txProps.arguments,
          tokenTransfers: [tokenTransfer],
        },
      )
    ).toPlainObject();

    return transaction;
  }

  async confirm(address: string, offerId: number) {
    const senderOffer = await this.received(address);

    const offer = senderOffer.find((offer) => offer.offerID === offerId);

    if (!offer) {
      throw new BadRequestException('Offer with provided id was not found');
    }
    const token = new Token({
      identifier: offer.acceptedPayment.tokenIdentifier,
      nonce: BigInt(offer.acceptedPayment.nonce),
    });

    const tokenTransfer = new TokenTransfer({
      token,
      amount: BigInt(offer.acceptedPayment.amount),
    });

    const txProps = this.createTransactionProps(address, 'acceptOffer', [
      offerId,
    ]);
    const transaction = (
      await this.transactionFactory.createTransactionForExecute(
        txProps.sender,
        {
          contract: txProps.contract,
          gasLimit: txProps.gasLimit,
          function: txProps.function,
          arguments: txProps.arguments,
          tokenTransfers: [tokenTransfer],
        },
      )
    ).toPlainObject();

    return transaction;
  }

  async cancel(address, offerId: number) {
    const txProps = this.createTransactionProps(address, 'cancelOffer', [
      offerId,
    ]);

    const transaction = (
      await this.transactionFactory.createTransactionForExecute(
        txProps.sender,
        {
          contract: txProps.contract,
          gasLimit: txProps.gasLimit,
          function: txProps.function,
          arguments: txProps.arguments,
        },
      )
    ).toPlainObject();

    return transaction;
  }

  private createTransactionProps(
    address: string,
    functionName: string,
    args: any[],
  ) {
    return {
      sender: Address.newFromBech32(address),
      contract: Address.newFromBech32(
        this.escrowConfigService.getEscrowSCAddress(),
      ),
      gasLimit: 60_000_000n,
      function: functionName,
      arguments: args,
    };
  }

  async created(address: string) {
    return await this.retrieveOffers(address, 'getCreatedOffers');
  }

  async received(address: string) {
    return await this.retrieveOffers(address, 'getWantedOffers');
  }

  private async retrieveOffers(
    address: string,
    functionName: string,
  ): Promise<Offer[]> {
    try {
      const query = this.smartContractController.createQuery({
        contract: Address.newFromBech32(
          this.escrowConfigService.getEscrowSCAddress(),
        ),
        function: functionName,
        arguments: [Address.newFromBech32(address)],
      });

      const response = await this.smartContractController.runQuery(query);
      const parsedResponse =
        this.smartContractController.parseQueryResponse(response);

      if (!parsedResponse || parsedResponse.length === 0) {
        return [];
      }

      const [offersPair] = parsedResponse;

      if (!offersPair) {
        return [];
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      const rawOffers = offersPair.valueOf();

      if (!Array.isArray(rawOffers)) {
        return [];
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      const offers: Offer[] = rawOffers.map(
        (offersPair: [BigNumber, OfferSCResponseDto]) => {
          return Offer.fromResponse(offersPair);
        },
      );

      return offers;
    } catch (error) {
      console.error('Error retrieving offers:', error);
      return [];
    }
  }
}
