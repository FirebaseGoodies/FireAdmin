import { Pipe, PipeTransform } from '@angular/core';
import { I18nService } from '../services/i18n.service';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'shortdate'
})
export class ShortDatePipe extends DatePipe implements PipeTransform {
  
  constructor(private i18nService: I18nService) {
    super(i18nService.getCurrentLanguage());
  }
  
  transform(value: any, format?: string, timezone?: string, locale?: string): string {
    return super.transform(value, format || 'dd MMMM yyyy', timezone, locale || this.i18nService.getCurrentLanguage());
  }

}
