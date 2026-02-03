import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OffersModule } from './endpoints/offers/offers.module';
import { ConfigModule } from '@nestjs/config';
import { EscrowConfigService } from './endpoints/offers/escrow-config/escrow-config.service';
import { MXNEST_CONFIG_SERVICE } from '@multiversx/sdk-nestjs-common';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), OffersModule],
  controllers: [AppController],
  providers: [
    AppService,
    EscrowConfigService,
    {
      provide: MXNEST_CONFIG_SERVICE,
      useClass: EscrowConfigService,
    },
  ],
})
export class AppModule {}
