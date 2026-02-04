"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OffersModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const offers_service_1 = require("./offers.service");
const offers_controller_1 = require("./offers.controller");
const escrow_config_service_1 = require("./escrow-config/escrow-config.service");
const sdk_nestjs_common_1 = require("@multiversx/sdk-nestjs-common");
let OffersModule = class OffersModule {
};
exports.OffersModule = OffersModule;
exports.OffersModule = OffersModule = __decorate([
    (0, common_1.Module)({
        controllers: [offers_controller_1.OffersController],
        providers: [
            offers_service_1.OffersService,
            escrow_config_service_1.EscrowConfigService,
            {
                provide: sdk_nestjs_common_1.MXNEST_CONFIG_SERVICE,
                useClass: escrow_config_service_1.EscrowConfigService,
            },
        ],
        imports: [config_1.ConfigModule.forRoot()],
    })
], OffersModule);
//# sourceMappingURL=offers.module.js.map