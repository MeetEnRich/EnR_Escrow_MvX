import { MxnestConfigService } from '@multiversx/sdk-nestjs-common';
import { ConfigService } from '@nestjs/config';
export declare class EscrowConfigService implements MxnestConfigService {
    private readonly configService;
    constructor(configService: ConfigService);
    getSecurityAdmins(): string[];
    getJwtSecret(): string;
    getNativeAuthMaxExpirySeconds(): number;
    getNativeAuthAcceptedOrigins(): string[];
    getApiUrl(): string;
    getChainId(): string;
    getEscrowSCAddress(): string;
}
