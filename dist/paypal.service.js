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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaypalService = void 0;
const common_1 = require("@nestjs/common");
const checkout_server_sdk_1 = __importDefault(require("@paypal/checkout-server-sdk"));
const config_1 = require("@nestjs/config");
let PaypalService = class PaypalService {
    constructor(configService) {
        this.configService = configService;
        const clientId = this.configService.get('PAYPAL_CLIENT_ID');
        const clientSecret = this.configService.get('PAYPAL_CLIENT_SECRET');
        console.log('🔑 PayPal Client ID loaded:', !!clientId);
        console.log('🔑 PayPal Client Secret loaded:', !!clientSecret);
        if (!clientId || !clientSecret) {
            throw new Error('❌ PayPal credentials NOT FOUND in .env file!');
        }
        const environment = new checkout_server_sdk_1.default.core.SandboxEnvironment(clientId, clientSecret);
        this.client = new checkout_server_sdk_1.default.core.PayPalHttpClient(environment);
    }
    async createOrder(amount, currency = 'GBP') {
        const request = new checkout_server_sdk_1.default.orders.OrdersCreateRequest();
        request.prefer('return=representation');
        request.requestBody({
            intent: 'CAPTURE',
            purchase_units: [{
                    amount: {
                        currency_code: currency,
                        value: amount.toFixed(2)
                    }
                }],
            application_context: {
                return_url: 'http://localhost:8080/pay/success',
                cancel_url: 'http://localhost:8080/pay/cancel'
            }
        });
        const response = await this.client.execute(request);
        const approvalLink = response.result.links.find((link) => link.rel === 'approve');
        return {
            approvalUrl: approvalLink.href,
            orderId: response.result.id
        };
    }
    async captureOrder(orderId) {
        const request = new checkout_server_sdk_1.default.orders.OrdersCaptureRequest(orderId);
        request.requestBody({});
        const response = await this.client.execute(request);
        return response.result;
    }
};
exports.PaypalService = PaypalService;
exports.PaypalService = PaypalService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], PaypalService);
