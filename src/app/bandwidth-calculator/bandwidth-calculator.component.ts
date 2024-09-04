import { Component } from '@angular/core';
import { UserServicesService } from '../services/user-services.service';

@Component({
  selector: 'app-bandwidth-calculator',
  templateUrl: './bandwidth-calculator.component.html',
  styleUrls: ['./bandwidth-calculator.component.css']
})
export class BandwidthCalculatorComponent {
  resolution: string = '';
  selectedResolution: string = '';
  horizontalPixels: number = 0;
  verticalPixels: number = 0;
  frameRate: number = 0;
  bitDepth: number = 0;
  channels: number = 3;
  resultPerChannel : number = 0;
  chromaFactor: number = 1;
  isOverheadEnabled: boolean = true;
  showResult: boolean = false;
  overheadValue: number = 1.25;
  overhValue: number = 1.25;
  finalResult: any;
  frameRates: number[] = [24, 25, 30, 50, 60, 120];
  bitDepths: number[] = [8, 10, 12, 16];
   resolutions = [
    { label: '1280 x 720 (HD)', value: '1280x720' },
    { label: '1920 x 1080 (FHD)', value: '1920x1080' },
    { label: '2560 x 1440 (HD)', value: '2560x1440' },
    { label: '3840 x 2160 (4K)', value: '3840x2160' },
    { label: '8192 x 4320 (8K)', value: '8192x4320' }
  ];
  
  constructor(private userService : UserServicesService) { }
  
    toggleOverhead() {
      if (this.isOverheadEnabled) {
        this.overheadValue = 1.25;
        this.overhValue = 1.25;
      } else {
        this.overheadValue = 0;
        this.overhValue = 1;
      }
    }
    
  onResolutionChange() {
    const [horizontal, vertical] = this.selectedResolution.split('x').map(Number);
    this.horizontalPixels = horizontal;
    this.verticalPixels = vertical;
  }


  onCalculate() {
    this.showResult = true;
    this.finalResult = this.horizontalPixels * this.verticalPixels * this.frameRate * this.bitDepth * 3 * this.chromaFactor * this.overhValue / 1000000000;
    this.resultPerChannel = this.finalResult/3;
  }

  onBack() {
    this.userService.onBack();
  }

}