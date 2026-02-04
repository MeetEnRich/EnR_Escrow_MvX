"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const offers_module_1 = require("./endpoints/offers/offers.module");
const config_1 = require("@nestjs/config");
const escrow_config_service_1 = require("./endpoints/offers/escrow-config/escrow-config.service");
const sdk_nestjs_common_1 = require("@multiversx/sdk-nestjs-common");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [config_1.ConfigModule.forRoot({ isGlobal: true }), offers_module_1.OffersModule],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            escrow_config_service_1.EscrowConfigService,
            {
                provide: sdk_nestjs_common_1.MXNEST_CONFIG_SERVICE,
                useClass: escrow_config_service_1.EscrowConfigService,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map