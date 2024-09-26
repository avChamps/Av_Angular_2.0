import { Component, OnInit } from '@angular/core';
import { UserServicesService } from '../services/user-services.service';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-aspect-ratio',
  templateUrl: './aspect-ratio.component.html',
  styleUrls: ['./aspect-ratio.component.css']
})
export class AspectRatioComponent implements OnInit {
  width: number = 0;
  height: number = 0;
  mode: string = '';
  aspectRatio1: number = 0;
  selectedCalculateOptions: string = 'aspectRatio';
  isAspectRatio: boolean = false;
  isShowWidth: boolean = true;
  isShowHeight: boolean = true;
  aspectRatio2: number = 0;
  showSpinner: boolean = false;
  showResult: boolean = false;
  pdfLoaded: boolean = false;
  aspectRatio: string = '0 : 0';
  dimensions: string = '0 * 0';
  units: any;
  selectedUnits: string = 'px';
  pdfUrl: string = './assets/pdf/AspectRatio.pdf';

  constructor(private userService: UserServicesService,private translate: TranslateService) { }
  ngOnInit(): void {
    let language = localStorage.getItem('selectedLanguage') || 'english';
    this.translate.setDefaultLang(language);
  }

  unitOptions = [
    { name: 'Pixels(px)', value: 'px' },
    { name: 'Inches(in)', value: 'in' },
    { name: 'Centimeter(cm)', value: 'cm' },
    { name: 'Millimeters(mm)', value: 'mm' }
  ];

  calculateOptions = [
    { name: 'Aspect Ratio', value: 'aspectRatio' },
    { name: 'Width', value: 'width' },
    { name: 'Height', value: 'height' }
  ]

  calculateAspectRatio(): void {
    this.showResult = true;

    // Helper function to calculate GCD
    const gcd = (a: number, b: number): number => {
      return b === 0 ? a : gcd(b, a % b);
    };

    let aspectRatioWidth: number;
    let aspectRatioHeight: number;

    // Use aspectRatio1 and aspectRatio2 for the aspect ratio if they are defined
    if (this.aspectRatio1 && this.aspectRatio2) {
      aspectRatioWidth = this.aspectRatio1;
      aspectRatioHeight = this.aspectRatio2;

      // Calculate the missing dimension based on the aspect ratio
      if (this.width && !this.height) {
        this.height = (this.width / aspectRatioWidth) * aspectRatioHeight;
      } else if (this.height && !this.width) {
        this.width = (this.height / aspectRatioHeight) * aspectRatioWidth;
      }
    } else {
      // If aspect ratio inputs are not provided, calculate the aspect ratio using the current width and height
      const divisor = gcd(this.width, this.height);
      aspectRatioWidth = this.width / divisor;
      aspectRatioHeight = this.height / divisor;
    }

    this.aspectRatio = `${aspectRatioWidth} : ${aspectRatioHeight}`;
    this.dimensions = `${Math.round(this.width)} × ${Math.round(this.height)}`;

    if (this.width > this.height) {
      this.mode = 'Landscape';
    } else if (this.width < this.height) {
      this.mode = 'Portrait';
    } else {
      this.mode = 'Square';
    }
  }


  clearDefaultZero(type: 'width' | 'height' | 'aspectRatio1' | 'aspectRatio2') {
    if (type === 'width' && this.width === 0) {
      this.width = undefined as any;
    } else if (type === 'height') {
      this.height = undefined as any;
    } else if (type === "aspectRatio1") {
      this.aspectRatio1 = undefined as any;
    } else {
      this.aspectRatio2 = undefined as any;
    }
  }

  onUnitChange(selectedUnit: any) {
    this.units = selectedUnit;
    this.selectedUnits = selectedUnit;
  }

  onOptionChange(value: string) {
    this.onReset();
    if (value === "aspectRatio") {
      this.isAspectRatio = false;
      this.isShowHeight = true;
      this.isShowWidth = true;
    } if (value === "width") {
      this.isShowWidth = true;
      this.isAspectRatio = true;
      this.isShowHeight = false;
    } if (value === "height") {
      this.isShowHeight = true;
      this.isAspectRatio = true;
      this.isShowWidth = false;
    }

    this.selectedCalculateOptions = value;
    console.log('Selected option:', value);
  }

  preventNegative(event: KeyboardEvent) {
    const maxLength = 4;
    if (event.key === '-' || event.key === 'e') {
      event.preventDefault();
    }
  }

  openPdf() {
    window.open(this.pdfUrl, '_blank');
  }

  onReset() {
    this.width = 0;
    this.height = 0;
    this.aspectRatio = '0 : 0';
    this.dimensions = '0 * 0';
    this.aspectRatio1 = 0;
    this.aspectRatio2 = 0;
    this.mode = '';
  }


  onBack() {
    this.userService.onBack();
  }

}
