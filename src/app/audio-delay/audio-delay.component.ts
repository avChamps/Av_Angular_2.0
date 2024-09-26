import { Component, OnInit } from '@angular/core';
import { UserServicesService } from '../services/user-services.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-audio-delay',
  templateUrl: './audio-delay.component.html',
  styleUrls: ['./audio-delay.component.css']
})
export class AudioDelayComponent implements OnInit {
  delayNeededInFeet = 0;
  distance : number = 0;
  delayNeededInMtr = 0;
  showSpinner: boolean = false;

  constructor(private userService: UserServicesService,private translate: TranslateService) { }
  ngOnInit(): void {
    let language = localStorage.getItem('selectedLanguage') || 'english';
    this.translate.setDefaultLang(language);
  }

  calculateAudio(): void {
    this.showSpinner = true;
    setTimeout(() => {
      this.delayNeededInFeet = (this.distance / 1125) * 1000;
      this.delayNeededInMtr = (this.distance / 343) * 1000;
      this.showSpinner = false;
    }, 700)
  }

  clearDefaultZero() {
    this.distance = undefined as any;
  }

  preventNegative(event: KeyboardEvent, inputValue: string) {
    const maxLength = 2;
    if (event.key === '-' || event.key === 'e' || inputValue.length >= maxLength) {
      event.preventDefault();
    }
  }

  onBack() {
    this.userService.onBack();
  }

  onReset() {
    this.delayNeededInFeet = 0;
    this.delayNeededInMtr = 0;
    this.distance = 0;
  }

}
