import { ModuleMetadata } from '@nestjs/common/interfaces';

export const EMAIL_MODULE_OPTIONS = 'EMAIL_MODULE_OPTIONS';
export const EMAIL_CONNECTION_TOKEN = 'EMAIL_CONNECTION_TOKEN';

export type ModuleOptions = {
  host: string;
  port: number;
  user: string;
  pass: string;
};

/**
 * async module options for beethoven global module
 */

export interface AsyncModuleOptions extends Pick<ModuleMetadata, 'imports'> {
  useFactory: (...args: any[]) => ModuleOptions | Promise<ModuleOptions>;
  inject?: any[];
  imports?: any[];
}
