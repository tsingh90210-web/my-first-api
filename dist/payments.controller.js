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
exports.PaymentsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const payments_service_1 = require("./payments.service");
const paypal_service_1 = require("./paypal.service");
let PaymentsController = class PaymentsController {
    constructor(paymentsService, paypalService) {
        this.paymentsService = paymentsService;
        this.paypalService = paypalService;
        // Temporary storage for current payment details
        this.currentPayment = null;
    }
    getPaymentForm() {
        return {};
    }
    async createOrder(body) {
        console.log('📥 Received form data:', body);
        try {
            const amount = Number(body.amount);
            const userName = body.userName || 'Customer';
            console.log('💰 Converted amount:', amount, '👤 Name:', userName);
            if (isNaN(amount) || amount <= 0) {
                console.log('❌ Invalid amount provided');
                return { error: 'Please enter a valid amount greater than 0' };
            }
            // Save details to use later when saving to database
            this.currentPayment = { userName, amount };
            const result = await this.paypalService.createOrder(amount, 'GBP');
            console.log('✅ PayPal order created successfully:', result);
            return result;
        }
        catch (fullError) {
            console.error('❌ FULL ERROR DETAILS:');
            console.error(fullError);
            return { error: 'Something went wrong creating your payment' };
        }
    }
    async capturePayment(body) {
        return this.paypalService.captureOrder(body.orderId);
    }
    async paymentSuccess(orderId) {
        try {
            if (!orderId) {
                return `
<div style="text-align:center; margin-top:80px; font-family: Arial, sans-serif;">
<h1 style="color:#28a745;">✅ Payment Completed</h1>
<p style="font-size:18px; margin-top:20px;">Your payment has been processed successfully.</p>
<p style="margin-top:30px;"><a href="/pay/dashboard" style="font-size:18px; color:#007bff;">View Payment Dashboard</a></p>
</div>`;
            }
            // Save payment with actual name and amount from your form
            const userName = this.currentPayment?.userName || 'Customer';
            const amount = this.currentPayment?.amount || 0;
            await this.paymentsService.savePayment(orderId, userName, amount);
            console.log('✅ Payment saved to database! Name:', userName, 'Amount:', amount);
            // Clear temporary data
            this.currentPayment = null;
            return `
<div style="text-align:center; margin-top:80px; font-family: Arial, sans-serif;">
<h1 style="color:#28a745;">✅ Payment Successful</h1>
<p style="font-size:18px; margin-top:20px;">Thank you! Your payment has been recorded permanently.</p>
<p style="margin-top:30px;"><a href="/pay/dashboard" style="font-size:18px; color:#007bff;">View Payment Dashboard</a></p>
</div>`;
        }
        catch (err) {
            console.error('❌ Error saving payment:', err);
            return `
<div style="text-align:center; margin-top:80px; font-family: Arial, sans-serif;">
<h1 style="color:#dc3545;">⚠️ Payment Processed</h1>
<p style="font-size:18px; margin-top:20px;">Your payment was successful, and will appear in your history shortly.</p>
<p style="margin-top:30px;"><a href="/pay/dashboard" style="font-size:18px; color:#007bff;">View Payment Dashboard</a></p>
</div>`;
        }
    }
    async paymentCancel() {
        this.currentPayment = null;
        return { message: 'Payment Cancelled' };
    }
    async dashboard() {
        const payments = await this.paymentsService.getPaymentHistory();
        return { payments };
    }
};
exports.PaymentsController = PaymentsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Payment form page' }),
    (0, common_1.Render)('payment'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "getPaymentForm", null);
__decorate([
    (0, common_1.Post)('create'),
    (0, swagger_1.ApiOperation)({ summary: 'Create new PayPal payment order' }),
    (0, swagger_1.ApiBody)({
        description: 'User name and payment amount',
        schema: {
            type: 'object',
            properties: {
                userName: { type: 'string', example: 'Paul Hunter', description: 'Full name of the payer' },
                amount: { type: 'number', example: 5.00, description: 'Payment amount in GBP' }
            },
            required: ['userName', 'amount']
        }
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "createOrder", null);
__decorate([
    (0, common_1.Post)('capture'),
    (0, swagger_1.ApiOperation)({ summary: 'Capture approved PayPal payment' }),
    (0, swagger_1.ApiBody)({
        description: 'PayPal order ID to capture',
        schema: {
            type: 'object',
            properties: {
                orderId: { type: 'string', example: '8WU968379K863424H', description: 'PayPal order ID from approval' }
            },
            required: ['orderId']
        }
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "capturePayment", null);
__decorate([
    (0, common_1.Get)('success'),
    (0, swagger_1.ApiOperation)({ summary: 'Payment success return page' }),
    (0, swagger_1.ApiQuery)({ name: 'token', required: false, description: 'PayPal approval token / order ID' }),
    __param(0, (0, common_1.Query)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "paymentSuccess", null);
__decorate([
    (0, common_1.Get)('cancel'),
    (0, swagger_1.ApiOperation)({ summary: 'Payment cancelled page' }),
    (0, common_1.Render)('cancel'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "paymentCancel", null);
__decorate([
    (0, common_1.Get)('dashboard'),
    (0, swagger_1.ApiOperation)({ summary: 'View all saved payments history' }),
    (0, common_1.Render)('dashboard'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "dashboard", null);
exports.PaymentsController = PaymentsController = __decorate([
    (0, swagger_1.ApiTags)('Payments'),
    (0, common_1.Controller)('pay'),
    __metadata("design:paramtypes", [payments_service_1.PaymentsService,
        paypal_service_1.PaypalService])
], PaymentsController);
