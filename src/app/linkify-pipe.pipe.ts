import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'linkifyPipe'
})
export class LinkifyPipePipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string): SafeHtml {
    if (!value) {
      return value;
    }

    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const replacedText = value.replace(urlRegex, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');

    return this.sanitizer.bypassSecurityTrustHtml(replacedText);
  }

}
