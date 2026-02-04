"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EscrowConfigService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let EscrowConfigService = class EscrowConfigService {
    configService;
    constructor(configService) {
        this.configService = configService;
    }
    getSecurityAdmins() {
        throw new Error('Method not implemented.');
    }
    getJwtSecret() {
        return this.configService.get('JWT_SECRET', '');
    }
    getNativeAuthMaxExpirySeconds() {
        return parseInt(this.configService.get('NATIVE_AUTH_MAX_EXPIRY_SECONDS'));
    }
    getNativeAuthAcceptedOrigins() {
        return this.configService
            .get('NATIVE_AUTH_ACCEPTED_ORIGINS', '')
            .split(',')
            .map((origin) => origin.trim());
    }
    getApiUrl() {
        return this.configService.get('API_ADDRESS', '');
    }
    getChainId() {
        return this.configService.get('CHAIN_ID', '');
    }
    getEscrowSCAddress() {
        return this.configService.get('ESCROW_CONTRACT_ADDRESS', '');
    }
};
exports.EscrowConfigService = EscrowConfigService;
exports.EscrowConfigService = EscrowConfigService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], EscrowConfigService);
//# sourceMappingURL=escrow-config.service.js.map