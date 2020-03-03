import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'escapeUrl',
  pure: false
})
export class EscapeUrlPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) { }

  transform(content: string) {
    return this.sanitizer.bypassSecurityTrustUrl(content);
  }

}
