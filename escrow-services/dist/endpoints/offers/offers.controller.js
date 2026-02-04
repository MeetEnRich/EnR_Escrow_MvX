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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OffersController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const offers_service_1 = require("./offers.service");
const create_offer_dto_1 = require("./dto/create-offer.dto");
const update_offer_dto_1 = require("./dto/update-offer.dto");
const swagger_1 = require("@nestjs/swagger");
const sdk_nestjs_auth_1 = require("@multiversx/sdk-nestjs-auth");
let OffersController = class OffersController {
    offersService;
    constructor(offersService) {
        this.offersService = offersService;
    }
    create(offer, address) {
        return this.offersService.create(address, offer);
    }
    confirm({ offerId }, address) {
        return this.offersService.confirm(address, offerId);
    }
    cancel({ offerId }, address) {
        return this.offersService.cancel(address, offerId);
    }
    created(address) {
        return this.offersService.created(address);
    }
    received(address) {
        return this.offersService.received(address);
    }
};
exports.OffersController = OffersController;
__decorate([
    (0, common_1.Post)('/create'),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, sdk_nestjs_auth_1.NativeAuth)('address')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_offer_dto_1.CreateOfferDto, String]),
    __metadata("design:returntype", void 0)
], OffersController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('/confirm'),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, sdk_nestjs_auth_1.NativeAuth)('address')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_offer_dto_1.UpdateOfferDto, String]),
    __metadata("design:returntype", void 0)
], OffersController.prototype, "confirm", null);
__decorate([
    (0, common_1.Post)('/cancel'),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, sdk_nestjs_auth_1.NativeAuth)('address')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_offer_dto_1.UpdateOfferDto, String]),
    __metadata("design:returntype", void 0)
], OffersController.prototype, "cancel", null);
__decorate([
    (0, common_1.Get)('/created'),
    openapi.ApiResponse({ status: 200, type: [require("./entities/offer.entity").Offer] }),
    __param(0, (0, sdk_nestjs_auth_1.NativeAuth)('address')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OffersController.prototype, "created", null);
__decorate([
    (0, common_1.Get)('/received'),
    openapi.ApiResponse({ status: 200, type: [require("./entities/offer.entity").Offer] }),
    __param(0, (0, sdk_nestjs_auth_1.NativeAuth)('address')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OffersController.prototype, "received", null);
exports.OffersController = OffersController = __decorate([
    (0, common_1.Controller)('offers'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(sdk_nestjs_auth_1.NativeAuthGuard),
    __metadata("design:paramtypes", [offers_service_1.OffersService])
], OffersController);
//# sourceMappingURL=offers.controller.js.map