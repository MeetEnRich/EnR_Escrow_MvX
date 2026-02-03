import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OffersService } from './offers.service';
import { OffersController } from './offers.controller';
import { EscrowConfigService } from './escrow-config/escrow-config.service';
import { MXNEST_CONFIG_SERVICE } from '@multiversx/sdk-nestjs-common';

@Module({
  controllers: [OffersController],
  providers: [
    OffersService,
    EscrowConfigService,
    {
      provide: MXNEST_CONFIG_SERVICE,
      useClass: EscrowConfigService,
    },
  ],
  imports: [ConfigModule.forRoot()],
})
export class OffersModule {}
