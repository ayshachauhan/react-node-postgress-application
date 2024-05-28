import { PipeTransform } from '@nestjs/common';

/**
 * Parse String to Boolean
 */
export class ParseStringToBooleanPipe
  implements PipeTransform<string, boolean>
{
  transform(value: string): boolean {
    value = value.toString().toLowerCase();
    return value === 'true' ? true : false;
  }
}
