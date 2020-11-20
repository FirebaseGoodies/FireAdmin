import { Pipe } from '@angular/core';
import { DateTimePipe } from './datetime.pipe';

@Pipe({
  name: 'shortdate'
})
export class ShortDatePipe extends DateTimePipe {
  
  transform(value: any, format?: string, timezone?: string, locale?: string): string {
    return super.transform(value, format || 'dd MMMM yyyy', timezone, locale);
  }

}
