import { Injectable } from '@nestjs/common';
import * as paypal from '@paypal/checkout-server-sdk';

@Injectable()
export class PaypalService {
  private client: paypal.core.PayPalHttpClient;

  constructor() {
    const clientId = process.env.PAYPAL_CLIENT_ID!;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET!;

    const environment = process.env.PAYPAL_MODE === 'live'
      ? new paypal.core.LiveEnvironment(clientId, clientSecret)
      : new paypal.core.SandboxEnvironment(clientId, clientSecret);

    this.client = new paypal.core.PayPalHttpClient(environment);
    // NO TIMEOUT LINE HERE
  }

  async createOrder(amount: string) {
    try {
      console.log('🔹 Creating order for:', amount);

      const request = new paypal.orders.OrdersCreateRequest();
      request.prefer('return=representation');
      request.requestBody({
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: { currency_code: 'GBP', value: amount }
          }
        ],
        application_context: {
          return_url: 'http://localhost:3000/paypal/success',
          cancel_url: 'http://localhost:3000/paypal/cancel'
        }
      });

      const response = await this.client.execute(request);
      return response.result;

    } catch (error) {
      console.error('❌ Service Error:', error.message);
      return { error: true, message: error.message, links: [] };
    }
  }

  async captureOrder(orderId: string) {
    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    request.requestBody({});
    const response = await this.client.execute(request);
    return response.result;
  }
}