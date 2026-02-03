import { MxnestConfigService } from '@multiversx/sdk-nestjs-common';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EscrowConfigService implements MxnestConfigService {
  constructor(private readonly configService: ConfigService) {}

  getSecurityAdmins(): string[] {
    throw new Error('Method not implemented.');
  }

  getJwtSecret(): string {
    return this.configService.get<string>('JWT_SECRET', '');
  }

  getNativeAuthMaxExpirySeconds(): number {
    return parseInt(
      <string>this.configService.get<string>('NATIVE_AUTH_MAX_EXPIRY_SECONDS'),
    );
  }

  getNativeAuthAcceptedOrigins(): string[] {
    return this.configService
      .get<string>('NATIVE_AUTH_ACCEPTED_ORIGINS', '')
      .split(',')
      .map((origin) => origin.trim());
  }

  getApiUrl(): string {
    return this.configService.get<string>('API_ADDRESS', '');
  }

  getChainId(): string {
    return this.configService.get<string>('CHAIN_ID', '');
  }

  getEscrowSCAddress(): string {
    return this.configService.get<string>('ESCROW_CONTRACT_ADDRESS', '');
  }
}
