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
exports.CreateOfferDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
class CreateOfferDto {
    offeredToken;
    offeredNonce;
    offeredAmount;
    acceptedToken;
    acceptedAmount;
    acceptedAddress;
    acceptedNonce;
    static _OPENAPI_METADATA_FACTORY() {
        return { offeredToken: { required: true, type: () => String }, offeredNonce: { required: true, type: () => Number }, offeredAmount: { required: true, type: () => String }, acceptedToken: { required: true, type: () => String }, acceptedAmount: { required: true, type: () => String }, acceptedAddress: { required: true, type: () => String }, acceptedNonce: { required: true, type: () => Number } };
    }
}
exports.CreateOfferDto = CreateOfferDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'WEGLD-bd4d79', description: 'Token identifier of the offered token' }),
    __metadata("design:type", String)
], CreateOfferDto.prototype, "offeredToken", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 0, description: 'Nonce of the offered token (0 for fungible tokens)' }),
    __metadata("design:type", Number)
], CreateOfferDto.prototype, "offeredNonce", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '1000000000000000000', description: 'Amount of offered token in smallest units' }),
    __metadata("design:type", String)
], CreateOfferDto.prototype, "offeredAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'USDC-c76f1f', description: 'Token identifier of the accepted token' }),
    __metadata("design:type", String)
], CreateOfferDto.prototype, "acceptedToken", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '100000000000000000', description: 'Amount of accepted token in smallest units' }),
    __metadata("design:type", String)
], CreateOfferDto.prototype, "acceptedAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'erd1...', description: 'Address that can accept this offer' }),
    __metadata("design:type", String)
], CreateOfferDto.prototype, "acceptedAddress", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 0, description: 'Nonce of the accepted token (0 for fungible tokens)' }),
    __metadata("design:type", Number)
], CreateOfferDto.prototype, "acceptedNonce", void 0);
//# sourceMappingURL=create-offer.dto.js.map