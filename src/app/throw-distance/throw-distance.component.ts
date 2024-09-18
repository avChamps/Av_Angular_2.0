import { Component } from '@angular/core';
import { UserServicesService } from '../services/user-services.service';
import { an } from '@fullcalendar/core/internal-common';

@Component({
  selector: 'app-throw-distance',
  templateUrl: './throw-distance.component.html',
  styleUrls: ['./throw-distance.component.css']
})
export class ThrowDistanceComponent {
  width: number = 0;
  projectionDistance: number = 0;
  throughRatio: number = 0;
  showSpinner : boolean = false;

  constructor(private userService: UserServicesService) { }

  onCalculate() {
    this.showSpinner = true;
    setTimeout(() => {
    this.projectionDistance = this.width * this.throughRatio;
    this.showSpinner = false;
    },700)
  }

  clearDefaultZero(type: 'width' | 'throughRatio') {
    if (type === 'width' && this.width === 0) {
      this.width = undefined as any;
    } else if (type === 'throughRatio') {
      this.throughRatio = undefined as any;
    }
  } 

  preventNegative(event: KeyboardEvent) {
    if (event.key === '-' || event.key === 'e') {
      event.preventDefault();
    }
  }

  onReset() {
    this.width = 0;
    this.throughRatio = 0;
  }

  onBack() {
    this.userService.onBack();
  }

}
