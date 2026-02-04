"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Offer = exports.offeredPayment = void 0;
const openapi = require("@nestjs/swagger");
class offeredPayment {
    tokenIdentifier;
    amount;
    nonce;
    numDecimals;
    static _OPENAPI_METADATA_FACTORY() {
        return { tokenIdentifier: { required: true, type: () => String }, amount: { required: true, type: () => String }, nonce: { required: true, type: () => Number }, numDecimals: { required: true, type: () => Number } };
    }
}
exports.offeredPayment = offeredPayment;
class Offer {
    offerID;
    creator;
    offeredPayment;
    acceptedPayment;
    acceptedAddress;
    static fromResponse(offerPair) {
        return {
            offerID: offerPair[0].toNumber(),
            creator: offerPair[1].creator.toString(),
            offeredPayment: {
                amount: offerPair[1].offered_payment.amount.toFixed(0),
                tokenIdentifier: offerPair[1].offered_payment.token_identifier,
                nonce: offerPair[1].offered_payment.token_nonce.toNumber(),
            },
            acceptedPayment: {
                amount: offerPair[1].accepted_payment.amount.toFixed(0),
                tokenIdentifier: offerPair[1].accepted_payment.token_identifier,
                nonce: offerPair[1].accepted_payment.token_nonce.toNumber(),
            },
            acceptedAddress: offerPair[1].accepted_address.toString(),
        };
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { offerID: { required: true, type: () => Number }, creator: { required: true, type: () => String }, offeredPayment: { required: true, type: () => require("./offer.entity").offeredPayment }, acceptedPayment: { required: true, type: () => require("./offer.entity").offeredPayment }, acceptedAddress: { required: true, type: () => String } };
    }
}
exports.Offer = Offer;
//# sourceMappingURL=offer.entity.js.map