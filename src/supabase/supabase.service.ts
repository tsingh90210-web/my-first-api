import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SupabaseService {
  private client;

  constructor(private configService: ConfigService) {
    this.client = createClient(
      this.configService.get('SUPABASE_URL')!,
      this.configService.get('SUPABASE_ANON_KEY')!
    );
  }

  getClient() {
    return this.client;
  }

  getAuth() {
    return this.client.auth;
  }
}