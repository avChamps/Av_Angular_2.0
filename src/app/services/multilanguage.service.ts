import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MultilanguageService {
  private languageSubject = new BehaviorSubject<string>('en');
  language$ = this.languageSubject.asObservable();

  constructor(private translate: TranslateService) {
    this.translate.setDefaultLang('en');
  }

  switchLanguage(lang: string) {
    this.translate.use(lang);
    this.languageSubject.next(lang);
  }
}
