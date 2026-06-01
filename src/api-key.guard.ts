import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private configService: ConfigService) {}
canActivate(
context: ExecutionContext,
): boolean | Promise<boolean> | Observable<boolean> {
const request = context.switchToHttp().getRequest<Request>();

// 1. Bypass security for PayPal routes so the frontend can talk to them freely
if (request.url.includes('paypal')) {
return true;
}
// 2. Original security check for everything else
const apiKey = request.headers['x-api-key'];
const validKey = this.configService.get<string>('API_KEY');

if (!apiKey || apiKey !== validKey) {
throw new UnauthorizedException('Invalid or missing API Key');
}

return true;
}
}