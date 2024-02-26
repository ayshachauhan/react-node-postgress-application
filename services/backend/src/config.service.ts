// config.service.ts

import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class CustomConfigService {
  constructor(private readonly configService: ConfigService) {}

  get(key: string): any {
    return this.configService.get(key);
  }
}
