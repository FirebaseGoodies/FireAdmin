import { Pipe } from '@angular/core';
import { DateTimePipe } from './datetime.pipe';
import { timestampToDate } from '../helpers/timestamp.helper';

@Pipe({
  name: 'timestamp'
})
export class TimestampPipe extends DateTimePipe {

  transform(value: any, format?: string, timezone?: string, locale?: string): string {
    value = timestampToDate(value);
    return super.transform(value, format, timezone, locale);
  }

}
